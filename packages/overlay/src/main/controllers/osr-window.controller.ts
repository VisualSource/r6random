import type {
	OverlayBrowserWindow,
	OverlayWindowOptions,
} from "@overwolf/ow-electron-packages-types";
import { ipcMain } from "electron/main";
import path from "node:path";
import type { OverlayService } from "../services/overlay.service";

export class OSRWindowController {
	public overlayWindow: OverlayBrowserWindow | null = null;

	constructor(private readonly overlayService: OverlayService) {}

	public quit() {
		this.overlayWindow = null;
		ipcMain.removeHandler("OSR::minimize");
	}

	public show() {
		if (!this.overlayWindow) return;
		this.overlayWindow.window.show();
	}
	public hide() {
		if (!this.overlayWindow) return;
		this.overlayWindow.window.hide();
	}

	public async createAndShow() {
		const opt: OverlayWindowOptions = {
			name: `osrWindow-${Math.floor(Math.random() * 1000)}`,
			height: 800,
			width: 1000,
			show: false,
			transparent: false,
			resizable: false,
			webPreferences: {
				preload: path.join(__dirname, "../preload/osr-preload.js"),
				devTools: false,
				nodeIntegration: false,
				contextIsolation: true,
			},
		};

		opt.x = 100;
		opt.y = 50;

		this.overlayWindow = await this.overlayService.createNewOsrWindow(opt);

		this.registerToIpc();
		this.registerToWindowEvents();

		await this.overlayWindow?.window.loadURL(
			import.meta.env.DEV
				? "http://192.168.1.10:5173/"
				: "https://visualsource.github.io/r6random/",
		);
	}

	private registerToIpc() {
		ipcMain.handle("OSR::minimize", () => {
			this.hide();
		});
	}
	private registerToWindowEvents() {
		const win = this.overlayWindow?.window;
		win?.on("closed", () => {
			this.overlayWindow = null;
			console.log("osr window closed");
		});
	}
}
