import { TeamSelector } from "@/components/TeamSelector";
import { type Team, useRouter } from "@/Router";
import { useEffect, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import operators from "../assets/operators.json"
import r6operators from "r6operators"
import prand from 'pure-rand';
import { Button } from "@/components/ui/button";
enum State {
    Wait = 0,
    Spinning = 1,
    Display = 2
}

const slotAngle = 360 / 12
const REEL_RADIUS = 150;

function getSeed(max: number) {
    const rnd = prand.xoroshiro128plus(Date.now() ^ (Math.random() * 0x100000000))
    const value = prand.unsafeUniformIntDistribution(0, max, rnd)
    return value
}

function generateLoadoutFromOp(op: string, team: Team) {
    const idx = operators[team].findIndex(e => e.id === op)
    const loadout = operators[team][idx].loadout

    const primaryIdx = getSeed(loadout.primary.length - 1)
    const secondaryIdx = getSeed(loadout.secondary.length - 1)
    const gadgetIdx = getSeed(loadout.gadget.length - 1)

    let utility = null
    if (op === "striker" || op === "sentry") {
        const utilityIdx = getSeed(loadout.gadget.length - 1)
        utility = loadout.gadget[utilityIdx]
    }

    return {
        primary: loadout.primary[primaryIdx],
        secondary: loadout.secondary[secondaryIdx],
        gadget: loadout.gadget[gadgetIdx],
        utility: utility
    }
}

// https://codepen.io/AdrianSandu/pen/MyBQYz
function spin(timer: number, max: number) {
    const el = document.getElementById("ring1")
    const seed = getSeed(max)

    const deg = (-5040 - (30 * seed))

    if (el) {

        const targetEl = el.querySelector(`[data-index="${seed}"]`)
        targetEl?.classList.remove("hidden")
        const targetDeg = Number.parseInt(targetEl?.getAttribute("data-deg") ?? "")

        const b = targetDeg + 360
        const c = b + 360
        const d = c + 360

        const old = el.querySelectorAll(`[data-deg="${b}"],[data-deg="${c}"],[data-deg="${d}"]`)

        for (const child of old) {
            child.classList.add("hidden")
        }

        el.setAttribute("data-target", seed.toString())
        el.classList.remove("spin-variable")
        el.removeAttribute("style")

        // restart animation: why? Dont know
        // https://stackoverflow.com/questions/6268508/restart-animation-in-css3-any-better-way-than-removing-the-element
        el.style.animation = "none"
        el.offsetHeight;
        (el.style.animation as never as string | null) = null

        el.classList.add("spin-variable")
        el.setAttribute("style", `--rotation: ${deg}deg; animation: back-spin 1s, spin ${timer + 1 * 0.5}s;`)
    }
}
// states 

// spin wait -> spinning -> display

const Spinner: React.FC<{ onDone: () => void }> = ({ onDone }) => {
    const { team } = useRouter()
    const [selected, _] = useLocalStorageState<string[]>(`r6r.${team}`, { defaultValue: [] })
    const target = useRef<HTMLDivElement>(null)

    useEffect(() => {

        if (target.current) {
            target.current.addEventListener("animationend", onDone)
        }
        return () => {
            target.current?.removeEventListener("animationend", onDone)
        }
    }, [onDone])

    return (
        <div id="stage" className="perspective-on relative">
            <div className="border-t border-b w-full h-20 absolute top-14 z-30">

            </div>
            <div id="rotate">
                <div ref={target} id="ring1" className="ring-container">
                    {selected.map((id, i) => (
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                        <div data-name={id} data-index={i} data-deg={slotAngle * i} dangerouslySetInnerHTML={{
                            __html: r6operators[id as keyof typeof r6operators]?.toSVG({ class: "object-fill h-full w-full" }) ?? ""
                        }}
                            key={`card-${id}`}
                            className="slot"
                            style={{ transform: `rotateX(${slotAngle * i}deg) translateZ(${REEL_RADIUS}px)` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

const Randomizer: React.FC = () => {
    const [gen, setGen] = useState<{ op: typeof r6operators.ace, loadout: { primary: string, secondary: string, gadget: string, utility: string | null } | null } | null>(null)
    const { team, generateLoadout, goTo } = useRouter()
    const [selected, _] = useLocalStorageState<string[]>(`r6r.${team}`, { defaultValue: [] })
    const [state, setState] = useState<State>(State.Spinning)

    return (
        <div className="flex flex-col h-full">
            <div className="flex relative">
                <TeamSelector />
                <button className="absolute left-2/3" type="button" onClick={() => goTo("/")}>⚙️</button>
            </div>

            <div className="container my-auto">
                {state === State.Display ? (
                    <div className="flex justify-center animate-in zoom-in-75 duration-1000">

                        <div className="flex flex-col">
                            <div className="flex">
                                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
                                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: gen?.op?.toSVG() ?? "" }} />
                                <div className="flex items-center">
                                    <h1 className="font-bold text-xl">{gen?.op?.name}</h1>
                                </div>
                            </div>
                            <div className="h-80 w-44 border rounded-sm p-2">
                                <img className="h-full w-full object-contain" src={`/ops/${gen?.op?.id}.webp`} alt={gen?.op?.name} />
                            </div>
                        </div>

                        {generateLoadout && gen?.loadout ? <div className="flex flex-col gap-2 ml-4">
                            <div className="bg-gray-600 px-4 py-2 min-w-36 max-w-48">
                                <h1 className="font-bold text-lg">Primary</h1>
                                <p className="text-muted-foreground">{gen?.loadout.primary.replaceAll("_", " ")}</p>
                                <div className="h-14">
                                    <img className="h-full w-full object-contain" src={`/weapons/${gen.loadout.primary}.webp`} alt={gen?.loadout.primary} />
                                </div>
                            </div>
                            <div className="bg-gray-600 px-4 py-2 max-w-48">
                                <h1 className="font-bold text-lg">Secondary</h1>
                                <p className="text-muted-foreground">{gen?.loadout.secondary.replaceAll("_", " ")}</p>
                                <div className="h-14">
                                    <img className="h-full w-full object-contain" src={`/weapons/${gen?.loadout.secondary}.webp`} alt={gen?.loadout.secondary} />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="bg-gray-600 px-4 py-2 min-w-36 max-w-48">
                                    <h1 className="font-bold text-lg">Gadget</h1>
                                    <p className="text-muted-foreground">{gen?.loadout.gadget.replaceAll("_", " ")}</p>
                                    <div className="h-14">
                                        <img className="h-full w-full object-contain" src={`/gadget/${gen?.loadout.gadget}.webp`} alt={gen?.loadout.gadget} />
                                    </div>
                                </div>
                                {gen?.loadout.utility ? (<div className="bg-gray-600 px-4 py-2">
                                    <h1 className="font-bold text-lg">Utility</h1>
                                    <p className="text-muted-foreground">{gen?.loadout.utility.replaceAll("_", " ")}</p>
                                    <div className="h-14">
                                        <img className="h-full w-full object-contain" src={`/gadget/${gen?.loadout.utility}.webp`} alt={gen?.loadout.utility} />
                                    </div>
                                </div>) : null}
                            </div>
                        </div> : null}
                    </div>
                ) : <Spinner onDone={() => {
                    const container = document.getElementById("ring1")
                    const targetId = container?.getAttribute("data-target")
                    const targetOp = container?.querySelector(`[data-index="${targetId}"]`)
                    const name = targetOp?.getAttribute("data-name")
                    const op = r6operators[name as keyof typeof r6operators]

                    let loadout = null
                    if (generateLoadout) {
                        loadout = generateLoadoutFromOp(op.id, team)
                    }

                    setGen({ op, loadout: loadout })
                    setTimeout(() => {
                        setState(State.Display)
                    }, 3000)
                }} />}
            </div>

            <div className="container flex justify-center my-6">
                <Button size="lg" className="bg-orange-500 text-accent-foreground hover:bg-orange-500/90 rounded-none" onClick={async () => {
                    if (state !== State.Spinning) {
                        setState(State.Spinning)
                        await new Promise((ok) => setTimeout(ok, 600))
                    }

                    spin(2, selected.length - 1)

                }}>Spin</Button>
            </div>
        </div>
    );
}
export default Randomizer