import { app } from "electron";
import { MainWindowController } from "./controllers/main-window.controller";
import { OverlayHotkeysService } from "./services/overlay-hotkeys.service";
import { OSRWindowController } from "./controllers/osr-window.controller";
import { OverlayInputService } from "./services/overlay-input.service";
import { OverlayService } from "./services/overlay.service";
import { Application } from "./application";


const bootstrap = () => {
	const overlayService = new OverlayService();
	const overlayHotkeysService = new OverlayHotkeysService(overlayService);
	const inputService = new OverlayInputService(overlayService);

	const createOsrWindowControllerFactory = () => {
		return new OSRWindowController(overlayService);
	};
	const mainWindowController = new MainWindowController(
		overlayService,
		overlayHotkeysService,
		inputService,
		createOsrWindowControllerFactory,
	);
	return new Application(overlayService, mainWindowController);
};

const lock = app.requestSingleInstanceLock();
if (lock) {
	const sys = bootstrap();

	app.whenReady().then(() => sys.run());

	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") {
			app.quit();
		}
	});
} else {
	app.quit();
}
