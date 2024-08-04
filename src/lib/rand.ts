import prand from "pure-rand";

export function getSeed(max: number) {
	const rnd = prand.xoroshiro128plus(
		Date.now() ^ (Math.random() * 0x100000000),
	);
	const value = prand.unsafeUniformIntDistribution(0, max, rnd);
	return value;
}
