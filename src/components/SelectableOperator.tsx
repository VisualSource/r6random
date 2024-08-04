import type r6operators from "r6operators";
import type { Team } from "@/Router";
import useLocalStorageState from "use-local-storage-state";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";


export const SelectableOperator: React.FC<{ team: Team, op: typeof r6operators.ace }> = ({ op, team }) => {
    const [s, setS] = useLocalStorageState<string[]>(`r6r.${team}`, {
        defaultValue: [],
    });

    const icon = useMemo(() => op.toSVG({
        class: cn("border-4 border-transparent transition-colors duration-200 ease-in-out",
            { "border-cyan-700": s.includes(op.id) }
        )
    }), [s, op])


    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button onClick={() => {
                    setS(e => e.findIndex(a => a === op.id) === -1 ? [...e, op.id] : e.filter(b => b !== op.id))
                }}
                    className="w-16 h-16"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                    dangerouslySetInnerHTML={{ __html: icon }}
                    type="button" />
            </TooltipTrigger>
            <TooltipContent>
                <p className="font-bold text-xl">{op.name}</p>
            </TooltipContent>
        </Tooltip>
    );
}