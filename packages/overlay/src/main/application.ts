import type { GameInfo, GameLaunchEvent, } from "@overwolf/ow-electron-packages-types";
import { kGameIds } from "@overwolf/ow-electron-packages-types/game-list";
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
		overlayService.on("ready", this.onOverlayServiceReady);
		overlayService.on(
			"injection-decision-handling",
			(ev: GameLaunchEvent, _info: GameInfo) => {
				ev.inject();
			},
		);
	}

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

	public onOverlayServiceReady = () => {
		this.overlayService.registerToGames([kGameIds.Rainbow6Siege]);
		this.mainWindowController.emitReady();
	};
	public run = () => {
		this.initTray();
		this.mainWindowController.createAndShow();
	};
}
