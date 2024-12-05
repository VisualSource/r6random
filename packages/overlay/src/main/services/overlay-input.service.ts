import type {
	GameInputInterception,
	GameWindowInfo,
	OverlayBrowserWindow,
} from "@overwolf/ow-electron-packages-types";
import type { OverlayService } from "./overlay.service";

export class OverlayInputService {
	private exclusiveModeBackgroundWindow: OverlayBrowserWindow | null = null;
	public exclusiveModeAsWindow = false;
	public mode: "toggle" | "auto" = "toggle";
	constructor(private overlayService: OverlayService) {
		this.init();
	}
	private init = () => {
		this.overlayService.on("game-injected", () => this.onNewGameInjected());
		this.overlayService.on("game-exit", (_, wasInjected: boolean) => {
			if (wasInjected) {
				this.onGameExit();
			}
		});
		this.overlayService.on("game-window-changed", (win: GameWindowInfo, _info, _reason) => {
			this.onUpdateGameWindow(win);
		});

		this.overlayService.on("game-input-interception-changed", (info: GameInputInterception) => {
			if (!info.canInterceptInput) {
				this.assureExclusiveModeWindow();
			}
		});
		this.overlayService.on("game-input-exclusive-mode-changed", (info: GameInputInterception) => {
			this.onGameExclusiveModeChanged(info);
		});
	};

	private onGameExclusiveModeChanged(info: GameInputInterception) {
		if (!this.exclusiveModeBackgroundWindow) return;
		if (!this.exclusiveModeAsWindow) {
			this.exclusiveModeBackgroundWindow.window.hide();
			return;
		}
		if (info.exclusiveMode) {
			this.exclusiveModeBackgroundWindow.window.show();
		}
		this.exclusiveModeBackgroundWindow.window.webContents.send(
			"EXCLUSIVE_MODE",
			info.exclusiveMode === true,
		);
	}

	private async assureExclusiveModeWindow() {
		if (!this.overlayService.api || !this.exclusiveModeAsWindow || this.exclusiveModeBackgroundWindow) {
			return;
		}

		const activeGame = this.overlayService.api.getActiveGameInfo()
		const width = activeGame?.gameWindowInfo.size.width ?? 500;
		const height = activeGame?.gameWindowInfo.size.height ?? 500;

		this.exclusiveModeBackgroundWindow = await this.overlayService.api.createWindow({
			name: "exclusiveModeBackground",
			height,
			width,
			show: true,
			passthrough: "passThrough",
			zOrder: "bottomMost",
			transparent: false,
			resizable: false,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				devTools: false,
			},
		});

		const ipc = this.exclusiveModeBackgroundWindow.window.webContents.ipc;

		ipc.on("HIDE_EXCLUSIVE", () => {
			this.exclusiveModeBackgroundWindow?.window.hide();
		});

		/*await this.exclusiveModeBackgroundWindow.window.loadURL(
			"https://visualsource.github.io/r6random/"
		);*/

		this.exclusiveModeBackgroundWindow.window.hide();
	}

	private onUpdateGameWindow(win: GameWindowInfo) {
		if (!this.exclusiveModeBackgroundWindow) return;
		this.exclusiveModeBackgroundWindow.window.setSize(
			win.size.width,
			win.size.height,
		);
	}

	private onGameExit() {
		this.exclusiveModeBackgroundWindow?.window.close();
		this.exclusiveModeBackgroundWindow = null;
	}

	private onNewGameInjected() {
		this.assureExclusiveModeWindow();
	}
}
