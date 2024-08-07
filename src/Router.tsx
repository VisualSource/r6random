import { createContext, useContext, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
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
	setGenerateLoadout: (value: boolean | ((value: boolean) => boolean)) => void;
	setTeam: (team: Team) => void;
	goTo: (page: Page) => void;
};

const router = createContext<RouterState | null>(null);

export const RouterProvider: React.FC = () => {
	const [currentPage, setCurrentPage] = useLocalStorageState("r6.page", {
		defaultValue: "/",
	});
	const [team, setTeam] = useLocalStorageState("r6.team", {
		defaultValue: "attackers",
	});
	const [generateLoadout, setGenerateLoadout] = useState<boolean>(true);

	const Page = PAGES[currentPage as Page];

	return (
		<router.Provider
			value={{
				team: team as Team,
				generateLoadout,
				setGenerateLoadout,
				setTeam,
				page: currentPage,
				goTo: setCurrentPage,
			}}
		>
			<Page />
		</router.Provider>
	);
};

export const useRouter = () => {
	const r = useContext(router);
	if (!r) throw new Error("useRouter is not inside router provider");
	return r;
};
