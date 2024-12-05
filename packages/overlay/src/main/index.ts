import electronUpdater, { type AppUpdater } from "electron-updater";
import log from "electron-log/main";
import { app } from "electron";
import { MainWindowController } from "./controllers/main-window.controller";
import { OverlayHotkeysService } from "./services/overlay-hotkeys.service";
import { OSRWindowController } from "./controllers/osr-window.controller";
import { OverlayInputService } from "./services/overlay-input.service";
import { OverlayService } from "./services/overlay.service";
import { Application } from "./application";
import { pkg } from "./utils";

function getAutoUpdater(): AppUpdater {
	// Using destructuring to access autoUpdater due to the CommonJS module of 'electron-updater'.
	// It is a workaround for ESM compatibility issues, see https://github.com/electron-userland/electron-builder/issues/7976.
	const { autoUpdater } = electronUpdater;
	return autoUpdater;
}

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
	log.initialize();
	const autoUpdate = getAutoUpdater();

	if (import.meta.env.PROD)
		autoUpdate.checkForUpdatesAndNotify().catch((e) => {
			console.error(e);
		});
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
