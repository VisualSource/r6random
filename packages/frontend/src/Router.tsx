import { createContext, useContext, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { R6DataProvider } from "./components/R6DataProvider";
import Randomizer from "./pages/Randomizer";
import Home from "./pages/Home";

const PAGES = {
	"/": Home,
	"/random": Randomizer,
};
export type Page = keyof typeof PAGES;
export type Team = "defenders" | "attackers";

export type RouterState = {
	page: string;
	team: Team;
	generateLoadout: boolean;
	weaponLoadouts: boolean;
	setWeaponLoadouts: (value: boolean | ((value: boolean) => boolean)) => void;
	setGenerateLoadout: (value: boolean | ((value: boolean) => boolean)) => void;
	setTeam: (team: Team) => void;
	goTo: (page: Page) => void;
};

const router = createContext<RouterState | null>(null);

export const RouterProvider: React.FC = () => {
	const [page, goTo] = useLocalStorageState("r6.page", {
		defaultValue: "/",
	});
	const [team, setTeam] = useLocalStorageState("r6.team", {
		defaultValue: "attackers",
	});
	const [generateLoadout, setGenerateLoadout] = useState<boolean>(true);
	const [weaponLoadouts, setWeaponLoadouts] = useState<boolean>(true);
	const Page = PAGES[page as Page];

	return (
		<R6DataProvider>
			<router.Provider
				value={{
					team: team as Team,
					weaponLoadouts,
					generateLoadout,
					page,
					setTeam,
					setGenerateLoadout,
					setWeaponLoadouts,
					goTo,
				}}
			>
				<Page />
			</router.Provider>
		</R6DataProvider>
	);
};

export const useRouter = () => {
	const r = useContext(router);
	if (!r) throw new Error("useRouter is not inside router provider");
	return r;
};
