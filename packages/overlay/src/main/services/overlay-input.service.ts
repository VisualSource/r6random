import type { GameInfo, GameInputInterception, GameWindowInfo, OverlayBrowserWindow } from "@overwolf/ow-electron-packages-types";
import { pkg } from "../utils";
import type { OverlayService } from "./overlay.service";

export class OverlayInputService {
    private exclusiveModeBackgroundWindow: OverlayBrowserWindow | null = null
    public exclusiveModeAsWindow = false;
    public mode: "toggle" | "auto" = "toggle";
    constructor(overlayService: OverlayService) {
        overlayService.on("ready", this.init);
    }

    public updateExclusiveModeOptions(options: { animationDuration?: number, color?: string }) {

    }

    private init = () => {
        this.registerExclusiveModeHotKey();

        pkg.overlay.on("game-injected", (info) => this.onNewGameInjected(info));
        pkg.overlay.on("game-exit", (_, wasInjected) => {
            if (wasInjected) { this.onGameExit(); }
        });
        pkg.overlay.on("game-window-changed", (win, _info, _reason) => {
            this.onUpdateGameWindow(win)
        });

        pkg.overlay.on("game-input-interception-changed", (info) => {
            if (!info.canInterceptInput) {
                this.assureExclusiveModeWindow();
            }
        });
        pkg.overlay.on("game-input-exclusive-mode-changed", (info) => {
            this.onGameExclusiveModeChanged(info);
        });
    }

    private onGameExclusiveModeChanged(info: GameInputInterception) {
        if (!this.exclusiveModeBackgroundWindow) return;
        if (!this.exclusiveModeAsWindow) {
            this.exclusiveModeBackgroundWindow.window.hide();
            return;
        }
        if (info.exclusiveMode) {
            this.exclusiveModeBackgroundWindow.window.show();
        }
        this.exclusiveModeBackgroundWindow.window.webContents.send("EXCLUSIVE_MODE", info.exclusiveMode === true);
    }

    private async assureExclusiveModeWindow() {
        if (!this.exclusiveModeAsWindow || this.exclusiveModeBackgroundWindow) {
            return;
        }

        const activeGame = pkg.overlay.getActiveGameInfo();
        const width = activeGame?.gameWindowInfo.size.width ?? 500;
        const height = activeGame?.gameWindowInfo.size.height ?? 500;

        this.exclusiveModeBackgroundWindow = await pkg.overlay.createWindow({
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
            }
        });

        const ipc = this.exclusiveModeBackgroundWindow.window.webContents.ipc

        ipc.on("HIDE_EXCLUSIVE", () => {
            this.exclusiveModeBackgroundWindow?.window.hide();
        });

        await this.exclusiveModeBackgroundWindow.window.loadURL(
            "https://visualsource.github.io/r6random/"
        );

        this.exclusiveModeBackgroundWindow.window.hide();
    }

    private onUpdateGameWindow(win: GameWindowInfo) {
        if (!this.exclusiveModeBackgroundWindow) return;
        this.exclusiveModeBackgroundWindow.window.setSize(
            win.size.width,
            win.size.height
        )
    }

    private onGameExit() {
        this.exclusiveModeBackgroundWindow?.window.close();
        this.exclusiveModeBackgroundWindow = null;
    }

    private onNewGameInjected(info: GameInfo) {
        this.assureExclusiveModeWindow();
    }

    private registerExclusiveModeHotKey() {
        pkg.overlay.hotkeys.register({
            name: "ExclusiveMode",
            keyCode: 9,
            modifiers: {
                ctrl: true
            },
            passthrough: false
        }, (hotkey, state) => this.onExclusiveModeHotKey(state === "pressed"));
    }

    private onExclusiveModeHotKey(state: boolean) {
        const info = pkg.overlay.getActiveGameInfo()?.gameInputInfo;
        if (!info) return;
        switch (this.mode) {
            case "toggle":
                this.onHotKeyToggle(state, info);
                break;
            case "auto":
                this.onHotkeyAutoRelease(state, info);
                break;
        }
    }
    private onHotKeyToggle(state: boolean, info: GameInputInterception) {
        if (!state) return;
        if (info.exclusiveMode === true) {
            pkg.overlay.exitExclusiveMode();
            return;
        }
        this.enterExclusiveMode();
    }
    private onHotkeyAutoRelease(state: boolean, _info: GameInputInterception) {
        if (!state) {
            pkg.overlay.exitExclusiveMode();
            return;
        }
        this.enterExclusiveMode();
    }

    private enterExclusiveMode() {
        if (this.exclusiveModeAsWindow) {
            pkg.overlay.enterExclusiveMode({});
            return;
        }

        this.exclusiveModeBackgroundWindow?.window.hide();
        pkg.overlay.enterExclusiveMode();
    }

}