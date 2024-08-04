import { Suspense } from "react";
import { RouterProvider } from "./Router";

const App: React.FC = () => {
	return (
		<Suspense fallback={<div>Loading</div>}>
			<RouterProvider />
		</Suspense>
	);
};

export default App;
