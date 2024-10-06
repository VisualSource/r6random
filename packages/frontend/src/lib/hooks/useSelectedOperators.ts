import useLocalStorageState from "use-local-storage-state";
import ops from "../../assets/operators.json";
import type { Team } from "@/Router";

const getDefaultSelected = (team: Team) => {
	if (team === "attackers") return ops.attackers.map(e => e.id);
	return ops.defenders.map(e => e.id);
}

export const useSelectedOperators = (team: Team) => {
	return useLocalStorageState<string[]>(`r6r.${team}`, {
		defaultValue: getDefaultSelected(team),
	});
};
