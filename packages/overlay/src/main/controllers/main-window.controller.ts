import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import type { OverlayHotkeysService } from "../services/overlay-hotkeys.service";
import type { OSRWindowController } from "../controllers/osr-window.controller";
import type { OverlayInputService } from "../services/overlay-input.service";
import type { OverlayService } from "../services/overlay.service";
import icon from "../../assets/icon.ico?asset";
import { pkg } from "../utils";

export class MainWindowController {
	private browserWindow: BrowserWindow | null = null;
	private osrWindow: OSRWindowController | null = null;
	private isQuiting = false;
	constructor(
		private readonly overlayService: OverlayService,
		private readonly overlayHotKeysService: OverlayHotkeysService,
		private readonly overlayInputService: OverlayInputService,
		private readonly createOsrWinController: () => OSRWindowController,
	) {
		overlayHotKeysService.on("hotkey::overlayToggle", () => this.toggleOsr());

		overlayService.on("log", this.printLogMessage);
		overlayService.on("error", this.printErrorMessage);
		overlayHotKeysService.on("log", this.printLogMessage);
		overlayHotKeysService.on("error", this.printErrorMessage);

		overlayService.on("inject-overlay", () => {
			this.createOSRWindow();
		});

		pkg.on("crashed", (_e, ...args) => {
			this.printLogMessage("package crashed", ...args);
		});

		pkg.on("failed-to-initialize", this.logPackageMangerErrors);

		app.on("before-quit", () => {
			this.isQuiting = true;
		});

		app.on("second-instance", () => {
			if (!this.browserWindow) return;

			if (this.browserWindow.isMinimized()) {
				this.browserWindow?.restore()
			} else {
				this.browserWindow.show();
			}
			this.browserWindow.focus();
		});
	}

	public toggleOsr() {
		if (!this.osrWindow) return;
		if (this.osrWindow.overlayWindow?.window.isVisible()) {
			this.osrWindow.hide();
		} else {
			this.osrWindow.show();
		}
	}
	public quitOsr() {
		if (!this.osrWindow) return;
		this.osrWindow.quit();
	}

	async emitReady() {
		this.browserWindow?.webContents.send("overlay-ready");
	}

	public quit() {
		this.isQuiting = true;
		app.quit();
	}

	public show() {
		this.browserWindow?.show();
	}

	private logPackageMangerErrors = (
		e: unknown,
		packageName: string,
		...args: unknown[]
	) => {
		this.printErrorMessage(
			"Overwolf Package Manager error!",
			packageName,
			...args,
		);
	};
	private printErrorMessage = (msg: string, ...args: unknown[]) => {
		if (this.browserWindow?.isDestroyed() ?? true) return;
		this.browserWindow?.webContents.send("console-log", msg, ...args);
	};
	private printLogMessage = (msg: string, ...args: unknown[]) => {
		if (this.browserWindow?.isDestroyed() ?? true) return;
		this.browserWindow?.webContents.send("console-log", msg, ...args);
	};

	public async createAndShow() {
		this.browserWindow = new BrowserWindow({
			width: 400,
			height: 300,
			resizable: false,
			show: true,
			icon: icon,
			autoHideMenuBar: true,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: path.join(__dirname, "../preload/preload.js"),
			},
		});

		this.registerToIpc();

		await this.browserWindow.loadFile(
			path.join(__dirname, "../renderer/index.html"),
		);

		this.browserWindow.on("minimize", (ev: Event) => {
			ev.preventDefault();
			this.browserWindow?.hide();
		});
		this.browserWindow.on("close", (ev) => {
			if (!this.isQuiting) {
				ev.preventDefault();
				this.browserWindow?.hide();
			}
			return false;
		});
	}

	private registerToIpc() {
		ipcMain.handle("createOSR", async () => this.createOSRWindow());
		ipcMain.handle("toggleOSRVisibility", async () => {
			for (const e of this.overlayService.api?.getAllWindows() ?? []) {
				e.window.show();
			}
		});
		ipcMain.handle("updateHotkey", (_ev, arg: { mod: string; key: string }) => {
			this.overlayHotKeysService.updateHotKey(arg.mod, arg.key);
		});
		ipcMain.handle("getCurrentHotKey", () =>
			this.overlayHotKeysService.getCurrentHotKey(),
		);
	}

	private async createOSRWindow(): Promise<void> {
		if (!this.osrWindow) {
			this.osrWindow = this.createOsrWinController();
			await this.osrWindow.createAndShow();
			this.osrWindow.overlayWindow?.window.on("closed", () => {
				this.printLogMessage("osr window closed");
			});
			return;
		}

		this.osrWindow.overlayWindow?.window.show();
	}
}
