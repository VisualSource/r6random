import r6operators from "r6operators";
import { useMemo } from "react";

import { useSelectedOperators } from "@/lib/hooks/useSelectedOperators";
import { SelectableOperator } from "@/components/SelectableOperator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TeamSelector } from "@/components/TeamSelector";
import operators from "../assets/operators.json";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/Router";

const Home: React.FC = () => {
	const { team, goTo, setGenerateLoadout, generateLoadout } = useRouter();
	const [_, setSelected] = useSelectedOperators(team);

	const ops = useMemo(() => {
		const t = operators[team as keyof typeof operators];

		if (!t) return [];

		return t.map((e) => {
			const op = r6operators[e.id as keyof typeof r6operators];
			if (!op) return null;
			return <SelectableOperator team={team} key={e.id} op={op} />;
		});
	}, [team]);

	return (
		<div className="flex flex-col h-full">
			<TeamSelector />
			<TooltipProvider>
				<div className="flex flex-wrap gap-4 container max-w-screen-sm my-auto">
					{ops}
				</div>
			</TooltipProvider>
			<div className="flex container justify-center gap-4 mt-auto mb-6">
				<Button
					onClick={() => goTo("/random")}
					className="rounded-none bg-blue-500 text-accent-foreground hover:bg-blue-500/90"
				>
					Lock In
				</Button>
				<Button
					onClick={() =>
						setSelected(
							operators[team as keyof typeof operators].map((e) => e.id),
						)
					}
					className="rounded-none"
				>
					Select All
				</Button>
				<Button onClick={() => setSelected([])} className="rounded-none">
					Deselect All
				</Button>
				<Button
					className="rounded-none bg-orange-500 text-accent-foreground hover:bg-orange-500/90"
					onClick={() => setGenerateLoadout((e) => !e)}
				>
					Random Loadout:{" "}
					<span className="ml-1">
						{generateLoadout ? "Enabled" : "Disabled"}
					</span>
				</Button>
				<Button
					className="rounded-none bg-orange-500 text-accent-foreground hover:bg-orange-500/90"
					disabled
				>
					Random Attachments: <span className="ml-1">Disabled</span>
				</Button>
			</div>
		</div>
	);
};
export default Home;
