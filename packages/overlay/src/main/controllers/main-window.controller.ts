import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import type { OverlayHotkeysService } from "../services/overlay-hotkeys.service";
import type { OSRWindowController } from "../controllers/osr-window.controller";
import type { OverlayInputService } from "../services/overlay-input.service";
import type { OverlayService } from "../services/overlay.service";
import icon from "../../assets/icon.ico?asset";

export class MainWindowController {
	private browserWindow: BrowserWindow | null = null;
	private osrWindow: OSRWindowController;
	private isQuiting = false;
	constructor(
		private readonly overlayService: OverlayService,
		private readonly overlayHotKeysService: OverlayHotkeysService,
		private readonly overlayInputService: OverlayInputService,
		private readonly createOsrWinController: () => OSRWindowController,
	) {
		this.osrWindow = createOsrWinController();

		overlayService.on("game-injected", () => {
			this.createAndShow();
		});

		overlayHotKeysService.on("hotkey::overlayToggle", () => this.toggleOsr());
		app.on("before-quit", () => {
			this.isQuiting = true;
		});

		app.on("second-instance", () => {
			if (!this.browserWindow) return;

			if (this.browserWindow.isMinimized()) {
				this.browserWindow?.restore();
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
		if (!this.browserWindow) throw new Error("There is not window to emit to");
		this.browserWindow.webContents.send("overlay-ready");
	}

	public quit() {
		this.isQuiting = true;
		app.quit();
	}

	public show() {
		this.browserWindow?.show();
	}

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

		this.browserWindow.on("close", (ev) => {
			if (!this.isQuiting) {
				ev.preventDefault();
				this.browserWindow?.hide();
			}
			return false;
		});
	}

	private registerToIpc() {
		ipcMain.handle("createOSR", async () => this.osrWindow.createOrShow());
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
}
