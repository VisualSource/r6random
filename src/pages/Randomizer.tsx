import { useCallback, useRef, useState } from "react";
import { Loadout, type OperatorLoadout } from "@/components/Loadout";
import { Spinner, type SpinnerRef } from "@/components/ui/Spinner";
import { TeamSelector } from "@/components/TeamSelector";
import { generateLoadoutFromOp } from "@/lib/loadout";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/Router";

enum State {
	Spinning = 0,
	Display = 1,
}

const Randomizer: React.FC = () => {
	const spinnerRef = useRef<SpinnerRef>(null)
	const [loadout, setLoadout] = useState<OperatorLoadout | null>(null);
	const { team, generateLoadout, goTo } = useRouter();
	const [isSpinning, setIsSpinning] = useState(false);
	const [state, setState] = useState<State>(State.Spinning);

	const onDone = useCallback(async () => {

		const operator = spinnerRef.current?.getOperator()
		if (!operator) return;

		let loadout = null;
		if (generateLoadout) {
			loadout = generateLoadoutFromOp(operator.id, team);
		}
		setLoadout({ operator, loadout: loadout });
		await new Promise(ok => setTimeout(ok, 3000));
		setState(State.Display);
		setIsSpinning(false);
	}, [generateLoadout, team,]);

	return (
		<div className="flex flex-col h-full">
			<TeamSelector />
			<div className="container my-auto">
				{state === State.Display ? (
					<Loadout data={loadout} generateLoadout={generateLoadout} />
				) : (
					<Spinner ref={spinnerRef}
						onDone={onDone}
					/>
				)}
			</div>

			<div className="container flex justify-center my-6 gap-2">
				<Button disabled={isSpinning}
					size="lg"
					className="bg-orange-500 text-accent-foreground hover:bg-orange-500/90 rounded-none"
					onClick={async () => {
						const audioEl = document.getElementById("sound-effect") as HTMLAudioElement;
						if (state !== State.Spinning) {
							setState(State.Spinning);
							await new Promise((ok) => setTimeout(ok, 600));
						}
						setIsSpinning(true)
						audioEl.play();
						setTimeout(() => spinnerRef.current?.spin(), 1000);
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
