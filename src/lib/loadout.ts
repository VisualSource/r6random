import operators from "../assets/operators.json";
import type { Team } from "@/Router";
import { getSeed } from "./rand";

export function generateLoadoutFromOp(op: string, team: Team) {
    const idx = operators[team].findIndex(e => e.id === op)
    const loadout = operators[team][idx].loadout

    const primaryIdx = getSeed(loadout.primary.length - 1)
    const secondaryIdx = getSeed(loadout.secondary.length - 1)
    const gadgetIdx = getSeed(loadout.gadget.length - 1)

    let utility = null
    if (op === "striker" || op === "sentry") {
        const utilityIdx = getSeed(loadout.gadget.length - 1)
        utility = loadout.gadget[utilityIdx]
    }

    return {
        primary: loadout.primary[primaryIdx],
        secondary: loadout.secondary[secondaryIdx],
        gadget: loadout.gadget[gadgetIdx],
        utility: utility
    }
}