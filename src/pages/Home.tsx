import r6operators from "r6operators"
import { useMemo } from "react";

import { TeamSelector } from "@/components/TeamSelector";
import operators from "../assets/operators.json"
import { type Team, useRouter } from "@/Router";
import { cn } from "@/lib/utils";
import useLocalStorageState from "use-local-storage-state";
import { Button, buttonVariants } from "@/components/ui/button";

const SelectableOperatorButton: React.FC<{ team: Team, op: typeof r6operators.ace }> = ({ op, team }) => {
    const [s, setS] = useLocalStorageState<string[]>(`r6r.${team}`, {
        defaultValue: [],
    })

    const icon = useMemo(() => op.toSVG({ class: cn("border-4 border-black transition-colors duration-200 ease-in-out", { "border-cyan-700": s.includes(op.id) }) }), [s, op])

    return (
        // biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: SVG ICON
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG ICON
        <button onClick={() => { setS(e => e.findIndex(a => a === op.id) === -1 ? [...e, op.id] : e.filter(b => b !== op.id)) }} className="w-16 h-16" dangerouslySetInnerHTML={{ __html: icon }} type="button" />
    );
}

const Home: React.FC = () => {
    const { team, goTo, setGenerateLoadout, generateLoadout } = useRouter()
    const [_, setSelected] = useLocalStorageState<string[]>(`r6r.${team}`, { defaultValue: [] })

    const ops = useMemo(() => {
        const t = operators[team as keyof typeof operators]

        if (!t) return []

        return t.map(e => {
            const op = r6operators[e.id as keyof typeof r6operators]
            if (!op) return null
            return (
                <SelectableOperatorButton team={team} key={e.id} op={op} />
            )
        })
    }, [team])

    return (
        <div className="flex flex-col h-full">
            <TeamSelector />
            <div className="flex flex-wrap gap-4 container max-w-screen-sm my-auto">
                {ops}
            </div>
            <div className="flex container justify-center gap-4 mt-auto mb-6">
                <Button onClick={() => goTo("/random")} className="rounded-none bg-blue-500 text-accent-foreground hover:bg-blue-500/90">Lock In</Button>
                <Button onClick={() => setSelected(operators[team as keyof typeof operators].map(e => e.id))} className="rounded-none">Select All</Button>
                <Button onClick={() => setSelected([])} className="rounded-none">Deselect All</Button>
                <Button className="rounded-none bg-orange-500 text-accent-foreground hover:bg-orange-500/90" onClick={() => setGenerateLoadout(e => !e)}>{generateLoadout ? (<span className="mr-1">✔️</span>) : null}Random Loadout</Button>
            </div>
        </div>
    );
}
export default Home;