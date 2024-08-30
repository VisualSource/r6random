export function hideOverlap(
	targetDeg: number,
	numOfItems: number,
	index: number,
	targets: HTMLDivElement[],
) {
	let deg = targetDeg;
	if (targetDeg > 360) {
		const rotations = Math.floor(targetDeg / 360);
		deg = targetDeg - 360 * rotations;
	}

	const iters = Math.round(numOfItems / 12);
	const indexStr = index.toString();
	for (let i = 0; i <= iters; i++) {
		const d = deg + 360 * i;

		for (const target of targets) {
			const item = target.querySelector(`[data-deg="${d}"]`);
			if (!item) continue;
			if (d === targetDeg) {
				item.classList.remove("hidden");
				continue;
			}
			item.classList.add("hidden");

			if (item.getAttribute("data-index") === indexStr) {
				item.classList.remove("hidden");
			}
		}
	}
}

export function resetAndSpin(el: HTMLDivElement, deg: number, timer: number) {
	el.classList.remove("spin-variable");
	el.removeAttribute("style");

	// restart animation: why? Dont know
	// https://stackoverflow.com/questions/6268508/restart-animation-in-css3-any-better-way-than-removing-the-element
	el.style.animation = "none";
	el.offsetHeight;
	(el.style.animation as never as string | null) = null;

	el.classList.add("spin-variable");
	el.setAttribute(
		"style",
		`--rotation: ${deg}deg; animation: 1s back-spin, ${timer}s spin;`,
	);
}
