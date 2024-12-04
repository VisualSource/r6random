import type operators from "../../data/operators.json"
import type weapons from "../../data/weapons.json";
import type { Team } from "@/Router";
import { getSeed } from "./rand";

export type OperatorList = typeof operators;
export type WeaponList = typeof weapons;

function getWeaponLoadout(weaponName: string, weapons: WeaponList) {
	const weapon = weapons[weaponName as keyof typeof weapons];
	if (!weapon) return null;

	return Object.entries(weapon).reduce(
		(prev, [key, values]) => {
			const item = getSeed(values.length - 1);
			prev[key] = values[item];
			return prev;
		},
		{} as Record<string, string>,
	);
}

export function generateLoadoutFromOp(
	op: string,
	team: Team,
	weaponLoadouts: boolean,
	operators: OperatorList,
	weapons: WeaponList
) {
	const idx = operators[team].findIndex((e) => e.id === op);
	const loadout = operators[team][idx].loadout;

	const primaryIdx = getSeed(loadout.primary.length - 1);
	const secondaryIdx = getSeed(loadout.secondary.length - 1);
	const gadgetIdx = getSeed(loadout.gadget.length - 1);

	let utility = null;
	if (op === "striker" || op === "sentry") {
		const utilityIdx = getSeed(loadout.gadget.length - 1);
		utility = loadout.gadget[utilityIdx];
	}

	return {
		primary: {
			weapon: loadout.primary[primaryIdx],
			loadout: weaponLoadouts
				? getWeaponLoadout(loadout.primary[primaryIdx], weapons)
				: null,
		},
		secondary: {
			weapon: loadout.secondary[secondaryIdx],
			loadout: weaponLoadouts
				? getWeaponLoadout(loadout.secondary[secondaryIdx], weapons)
				: null,
		},
		gadget: loadout.gadget[gadgetIdx],
		utility: utility,
	};
}
