import { Suspense } from "react";
import { RouterProvider } from "./Router";

/*
	<audio id="sound-effect" autoPlay={false} controls={false} src={`${import.meta.env.BASE_URL}effect.ogg`} preload="auto">
				<track kind="captions" />
			</audio>
*/

const App: React.FC = () => {
	return (
		<>
			<Suspense fallback={<div>Loading</div>}>
				<RouterProvider />
			</Suspense>
		</>
	);
};

export default App;
