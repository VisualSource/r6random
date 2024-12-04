import useLocalStorageState from "use-local-storage-state";
import type { Team } from "@/Router";
import { useR6Data } from "./useR6Data";

const getDefaultSelected = (team: Team) => {
	const { data } = useR6Data<true>();

	if (team === "attackers") return data.operators.attackers.map(e => e.id);
	return data.operators.defenders.map(e => e.id);
}

export const useSelectedOperators = (team: Team) => {
	return useLocalStorageState<string[]>(`r6r.${team}`, {
		defaultValue: getDefaultSelected(team),
	});
};
