import { useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import useLocalStorageState from "use-local-storage-state";
import r6operators from "r6operators";
import { hideOverlap, resetAndSpin } from "@/lib/spinnerUtils";
import { loadItem } from "@/lib/load";
import { useRouter } from "@/Router";
import { getSeed } from "@/lib/rand";
import { Side } from "./Side";
import { Ring } from "./Ring";

export type SpinnerRef = { spin: () => void, getOperator: () => r6operators.Operator | null }

/**
 * @see https://codepen.io/AdrianSandu/pen/MyBQYz
 */
export const Spinner = forwardRef<SpinnerRef, { onDone: () => void }>(({ onDone }, ref) => {
	const { team } = useRouter();
	const [selected, _] = useLocalStorageState<string[]>(`r6r.${team}`, {
		defaultValue: [],
	});
	const ringRefThree = useRef<HTMLDivElement>(null);
	const ringRefTwo = useRef<HTMLDivElement>(null);
	const ringRefOne = useRef<HTMLDivElement>(null);

	useImperativeHandle(ref, () => {
		return {
			getOperator() {
				const prev = loadItem(`r6.prev-${team}`, 0)
				const target = ringRefThree.current?.querySelector(`[data-index="${prev}"]`);
				if (!target) return null;
				const name = target?.getAttribute("data-name")
				if (!name) return null;
				return r6operators[name as keyof typeof r6operators] ?? null;
			},
			spin() {
				const max = selected.length - 1
				if (!ringRefOne.current || !ringRefTwo.current || !ringRefThree.current) return;
				let seed = getSeed(max);
				const prev = loadItem(`r6.prev-${team}`, 0)

				if ((max > 1) && prev && seed === prev) {
					let i = 0;
					while (i < 50) {
						seed = getSeed(max)
						if (seed !== prev) {
							break;
						}
						i++;
					}
				}

				console.log(`Pev: ${prev} | Next: ${seed}`)

				localStorage.setItem(`r6.prev-${team}`, seed.toString());

				const targetElement = ringRefThree.current.querySelector(`[data-index="${seed}"]`)
				const targetDeg = Number.parseInt(targetElement?.getAttribute("data-deg") ?? "0")

				hideOverlap(ringRefOne.current, targetDeg, selected.length, seed)
				hideOverlap(ringRefTwo.current, targetDeg, selected.length, seed)
				hideOverlap(ringRefThree.current, targetDeg, selected.length, seed)

				const deg = -5040 - 30 * seed;

				resetAndSpin(ringRefOne.current, deg, 1)
				resetAndSpin(ringRefTwo.current, deg, 1.5)
				resetAndSpin(ringRefThree.current, deg, 2)
			},
		}
	})

	const targets = useMemo(() => selected.map((id, i) => (
		<Side key={id} id={id} index={i} />
	)), [selected])

	useEffect(() => {
		if (ringRefThree.current) {
			ringRefThree.current.addEventListener("animationend", onDone);
		}
		return () => {
			ringRefThree.current?.removeEventListener("animationend", onDone);
		};
	}, [onDone]);

	return (
		<div id="stage" className="perspective-on relative">

			<div id="rotate">
				<Ring ref={ringRefOne} items={targets} id="ring1" />
				<Ring ref={ringRefTwo} items={targets} id="ring2" />
				<Ring ref={ringRefThree} items={targets} id="ring3" />
			</div>
		</div>
	);
});
