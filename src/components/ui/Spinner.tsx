import useLocalStorageState from "use-local-storage-state"
import { useEffect, useRef } from "react"
import r6operators from "r6operators"
import { useRouter } from "@/Router"

const SLOT_ANGLE = 360 / 12
const REEL_RADIUS = 150;

export const Spinner: React.FC<{ onDone: () => void }> = ({ onDone }) => {
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
                        <div data-name={id} data-index={i} data-deg={SLOT_ANGLE * i} dangerouslySetInnerHTML={{
                            __html: r6operators[id as keyof typeof r6operators]?.toSVG({ class: "object-fill h-full w-full" }) ?? ""
                        }}
                            key={`card-${id}`}
                            className="slot"
                            style={{ transform: `rotateX(${SLOT_ANGLE * i}deg) translateZ(${REEL_RADIUS}px)` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}