import { Suspense } from "react";
import { RouterProvider } from "./Router";
import { isElectron } from "./lib/utils";
import { Minus, X } from "lucide-react";

interface EmbedWindow {
	app: {
		quit: () => void,
		minimize: () => void
	}
}

const isInElectron = isElectron();

const App: React.FC = () => {
	return (
		<>
			{isInElectron ? (
				<div className="window-drag flex bg-gray-700 justify-end px-2 py-1.5 gap-2">
					<div className="flex gap-2 window-no-drag">
						{import.meta.env.DEV ? (<button type="button" onClick={() => window.location.reload()}>Reload</button>) : null}
						<button type="button" onClick={() => (window as typeof window & EmbedWindow).app.minimize()}><Minus /></button>
						<button type="button" onClick={() => {
							(window as typeof window & EmbedWindow).app.quit()
						}}>
							<X />
						</button>
					</div>

				</div>
			) : null
			}
			<Suspense fallback={<div>Loading</div>}>
				<RouterProvider />
			</Suspense>
		</>
	);
};

export default App;
