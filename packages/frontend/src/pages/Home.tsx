import r6operators from "r6operators";
import { useMemo } from "react";

import { useSelectedOperators } from "@/lib/hooks/useSelectedOperators";
import { SelectableOperator } from "@/components/SelectableOperator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TeamSelector } from "@/components/TeamSelector";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/Router";
import { useR6Data } from "@/lib/hooks/useR6Data";
import { Season } from "@/components/Season";

const Home: React.FC = () => {
	const {
		team,
		goTo,
		setGenerateLoadout,
		generateLoadout,
		weaponLoadouts,
		setWeaponLoadouts,
	} = useRouter();
	const [_, setSelected] = useSelectedOperators(team);
	const r6Data = useR6Data<true>();

	const operators = r6Data.data.operators[team] ?? [];

	const ops = useMemo(() => {
		return operators.map((e) => {
			const op = r6operators[e.id as keyof typeof r6operators];
			if (!op) return null;
			return <SelectableOperator team={team} key={e.id} op={op} />;
		});
	}, [team, operators]);

	return (
		<div className="flex flex-col h-full">
			<Season />
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
							operators.map((e) => e.id),
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
					onClick={() => setWeaponLoadouts((e) => !e)}
				>
					Random Attachments:{" "}
					<span className="ml-1">
						{weaponLoadouts ? "Enabled" : "Disabled"}
					</span>
				</Button>
			</div>
		</div>
	);
};
export default Home;
