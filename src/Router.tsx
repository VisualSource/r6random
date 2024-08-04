import {
	createContext,
	useCallback,
	useContext,
	useState,
	useTransition,
} from "react";
import Home from "./pages/Home";
import Randomizer from "./pages/Randomizer";

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
	const [generateLoadout, setGenerateLoadout] = useState<boolean>(true);
	const [team, setTeam] = useState(
		(localStorage.getItem("r6r.team") as Team) ?? "attackers",
	);
	const [currentPage, setCurrentPage] = useState<Page>(
		(localStorage.getItem("r6r.page") as Page) ?? "/",
	);
	const [_, startTransition] = useTransition();
	const goTo = useCallback((page: Page) => {
		startTransition(() => {
			setCurrentPage(page);
		});
	}, []);

	const Page = PAGES[currentPage];

	return (
		<router.Provider
			value={{
				team,
				generateLoadout,
				setGenerateLoadout,
				setTeam,
				page: currentPage,
				goTo,
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
