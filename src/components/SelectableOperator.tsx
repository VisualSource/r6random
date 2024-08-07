import type r6operators from "r6operators";
import { useSelectedOperators } from "@/lib/hooks/useSelectedOperators";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import type { Team } from "@/Router";
import { cn } from "@/lib/utils";

export const SelectableOperator: React.FC<{
	team: Team;
	op: typeof r6operators.ace;
}> = ({ op, team }) => {
	const [selected, setSelected] = useSelectedOperators(team);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					onClick={() => {
						setSelected((e) =>
							e.findIndex((a) => a === op.id) === -1
								? [...e, op.id]
								: e.filter((b) => b !== op.id),
						);
					}}
					className="w-16 h-16"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{
						__html: op.toSVG({
							class: cn(
								"border-4 border-transparent transition-colors duration-200 ease-in-out",
								{ "border-cyan-700": selected.includes(op.id) },
							),
						}),
					}}
					type="button"
				/>
			</TooltipTrigger>
			<TooltipContent>
				<p className="font-bold text-xl">{op.name}</p>
			</TooltipContent>
		</Tooltip>
	);
};
