import { useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import r6operators from "r6operators";
import { hideOverlap, resetAndSpin } from "@/lib/spinnerUtils";
import { loadItem } from "@/lib/load";
import { useRouter } from "@/Router";
import { getSeed } from "@/lib/rand";
import { Side } from "./Side";
import { useSelectedOperators } from "@/lib/hooks/useSelectedOperators";
import { cn } from "@/lib/utils";

export type SpinnerRef = {
	spin: () => void;
	getOperator: () => r6operators.Operator | null;
};

/**
 * @see https://codepen.io/AdrianSandu/pen/MyBQYz
 */
export const Spinner = forwardRef<
	SpinnerRef,
	{ show: boolean; onAnimationEnd: () => void }
>(({ onAnimationEnd, show }, ref) => {
	const ringRefThree = useRef<HTMLDivElement>(null);
	const ringRefTwo = useRef<HTMLDivElement>(null);
	const ringRefOne = useRef<HTMLDivElement>(null);
	const { team } = useRouter();
	const [selected, _] = useSelectedOperators(team);

	useImperativeHandle(ref, () => {
		return {
			getOperator() {
				const prev = loadItem(`r6.prev-${team}`, 0);
				const target = ringRefThree.current?.querySelector(
					`[data-index="${prev}"]`,
				);
				if (!target) return null;
				const name = target?.getAttribute("data-name");
				if (!name) return null;
				return r6operators[name as keyof typeof r6operators] ?? null;
			},
			spin() {
				const max = selected.length - 1;
				if (
					!ringRefOne.current ||
					!ringRefTwo.current ||
					!ringRefThree.current
				) {
					console.warn(
						`Missing references to rings: Ring One: ${!ringRefOne.current ? "false" : "true"}, Ring Two: ${!ringRefTwo.current ? "false" : "true"}, Ring Three: ${!ringRefThree.current ? "false" : "true"}`,
					);
					return;
				}
				let seed = getSeed(max);
				const prev = loadItem(`r6.prev-${team}`, 0);

				if (max > 1 && prev && seed === prev) {
					let i = 0;
					while (i < 50) {
						seed = getSeed(max);
						if (seed !== prev) {
							break;
						}
						i++;
					}
				}
				console.info(`Prev: ${prev} | Next: ${seed}`);

				localStorage.setItem(`r6.prev-${team}`, seed.toString());

				try {
					const targetElement = ringRefThree.current.querySelector(
						`[data-index="${seed}"]`,
					);
					const targetDeg = Number.parseInt(
						targetElement?.getAttribute("data-deg") ?? "0",
					);

					hideOverlap(targetDeg, selected.length, seed, [
						ringRefOne.current,
						ringRefTwo.current,
						ringRefThree.current,
					]);

					const deg = -5040 - 30 * seed;

					resetAndSpin(ringRefOne.current, deg, 1);
					resetAndSpin(ringRefTwo.current, deg, 1.5);
					resetAndSpin(ringRefThree.current, deg, 2);
				} catch (error) {
					console.error(error);
				}
			},
		};
	});

	const targets = useMemo(
		() => selected.map((id, i) => <Side key={id} id={id} index={i} />),
		[selected],
	);

	return (
		<div
			id="stage"
			className={cn("perspective-on relative", {
				"animate-in fade-in-5": show,
				hidden: !show,
			})}
		>
			<div id="rotate">
				<div
					onAnimationStartCapture={() => {}}
					ref={ringRefOne}
					id="ring1"
					className="ring-container"
				>
					{targets}
				</div>
				<div ref={ringRefTwo} id="ring2" className="ring-container">
					{targets}
				</div>
				<div
					ref={ringRefThree}
					id="ring3"
					className="ring-container"
					onAnimationEnd={onAnimationEnd}
				>
					{targets}
				</div>
			</div>
		</div>
	);
});
