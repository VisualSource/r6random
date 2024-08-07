import useLocalStorageState from "use-local-storage-state";
import type { Team } from "@/Router";

export const useSelectedOperators = (team: Team) => {
	return useLocalStorageState<string[]>(`r6r.${team}`, {
		defaultValue: [],
	});
};
