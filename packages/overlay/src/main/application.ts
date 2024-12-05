import { Menu, nativeImage, Tray } from "electron";
import type { MainWindowController } from "./controllers/main-window.controller";
import type { OverlayService } from "./services/overlay.service";
import TrayIcon from "../assets/icon.ico?asset";

export class Application {
	private tray: Tray | null = null;
	constructor(
		private readonly overlayService: OverlayService,
		private readonly mainWindowController: MainWindowController,
	) {
		overlayService.on("ready", () => this.mainWindowController.emitReady());
	}
	public run = () => {
		this.initTray();
		this.mainWindowController.createAndShow();
	};

	private initTray() {
		const icon = nativeImage.createFromPath(TrayIcon);
		this.tray = new Tray(icon);
		const menu = Menu.buildFromTemplate([
			{
				label: "Show",
				type: "normal",
				click: () => this.mainWindowController.show(),
				toolTip: "Show R6Random",
			},
			{ type: "separator" },
			{
				label: "Quit",
				type: "normal",
				click: () => this.mainWindowController.quit(),
				toolTip: "Quit R6Random",
			},
		]);

		this.tray.setToolTip("R6Random");
		this.tray.setContextMenu(menu);
	}
}
