import { useCallback, useRef, useState } from "react";
import { Loadout, type OperatorLoadout } from "@/components/Loadout";
import { Spinner, type SpinnerRef } from "@/components/ui/Spinner";
import { TeamSelector } from "@/components/TeamSelector";
import { generateLoadoutFromOp } from "@/lib/loadout";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/Router";
import r6operators from "r6operators";
import debounce from "lodash.debounce";

enum State {
	Init = -1,
	Spinning = 0,
	Display = 1,
}

const Randomizer: React.FC = () => {
	const [loadout, setLoadout] = useState<OperatorLoadout | null>({
		operator: r6operators.ace,
		loadout: null,
	});
	const [state, setState] = useState<State>(State.Init);
	const { team, generateLoadout, weaponLoadouts, goTo } = useRouter();
	const spinnerRef = useRef<SpinnerRef>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: team and generateLoadout variables are used
	const onSpinnerEnd = useCallback(
		debounce(async () => {
			const operator = spinnerRef.current?.getOperator();
			if (!operator) {
				console.error("Failed to get operator");
				return;
			}

			let loadout = null;
			if (generateLoadout) {
				console.log(team);
				loadout = generateLoadoutFromOp(operator.id, team, weaponLoadouts);
			}

			setLoadout({ operator, loadout });
			await new Promise<void>((ok) => setTimeout(ok, 600));
			setState(State.Display);
		}, 3000),
		[team, generateLoadout, weaponLoadouts],
	);

	return (
		<div className="flex flex-col h-full">
			<TeamSelector />
			<div className="container my-auto">
				<Loadout
					show={state === State.Display}
					data={loadout}
					generateLoadout={generateLoadout}
				/>
				<Spinner
					show={state === State.Spinning || state === State.Init}
					ref={spinnerRef}
					onAnimationEnd={onSpinnerEnd}
				/>
			</div>
			<div className="container flex justify-center my-6 gap-2">
				<Button
					disabled={state === State.Spinning}
					size="lg"
					className="bg-orange-500 text-accent-foreground hover:bg-orange-500/90 rounded-none"
					onClick={async () => {
						setState(State.Spinning);
						await new Promise<void>((ok) => setTimeout(ok, 1000));
						spinnerRef.current?.spin();
					}}
				>
					Spin
				</Button>
				<Button size="lg" className="rounded-none" onClick={() => goTo("/")}>
					⚙️ Settings
				</Button>
			</div>
		</div>
	);
};
export default Randomizer;
