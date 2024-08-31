import { BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { pkg } from "../utils";
import type { OverlayService } from "../services/overlay.service";
import type { OverlayHotkeysService } from "../services/overlay-hotkeys.service";
import type { OverlayInputService } from "../services/overlay-input.service";
import type { OSRWindowController } from "../controllers/osr-window.controller";

export class MainWindowController {
    private browserWindow: BrowserWindow | null = null;
    private osrWindow: OSRWindowController | null = null;

    constructor(
        private readonly overlayService: OverlayService,
        private readonly overlayHotKeysService: OverlayHotkeysService,
        private readonly overlayInputService: OverlayInputService,
        private readonly createOsrWinController: () => OSRWindowController
    ) {

        overlayHotKeysService.on("hotkey::overlayToggle", () => this.toggleOsr());

        overlayService.on("log", this.printLogMessage);
        overlayService.on("error", this.printErrorMessage);
        overlayHotKeysService.on("log", this.printLogMessage);
        overlayHotKeysService.on("error", this.printErrorMessage);

        pkg.on("crashed", (_e, ...args) => {
            this.printLogMessage("package crashed", ...args);
        });

        pkg.on("failed-to-initialize", this.logPackageMangerErrors);
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
        this.browserWindow?.webContents.send("overlay-injected");
        await this.createOSRWindow();
    }

    private logPackageMangerErrors = (e: unknown, packageName: string, ...args: unknown[]) => {
        this.printErrorMessage("Overwolf Package Manager error!", packageName, ...args);
    }
    private printErrorMessage = (msg: string, ...args: unknown[]) => {
        if (this.browserWindow?.isDestroyed() ?? true) return;
        this.browserWindow?.webContents.send("console-log", msg, ...args);
    }
    private printLogMessage = (msg: string, ...args: unknown[]) => {
        if (this.browserWindow?.isDestroyed() ?? true) return;
        this.browserWindow?.webContents.send("console-log", msg, ...args);
    }

    public async createAndShow() {
        this.browserWindow = new BrowserWindow({
            width: 400,
            height: 300,
            resizable: false,
            show: true,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, "../preload/preload.js")
            }
        });

        this.registerToIpc();

        await this.browserWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
    }

    private registerToIpc() {
        ipcMain.handle("createOSR", async () => this.createOSRWindow());
        ipcMain.handle("toggleOSRVisibility", async () => {
            for (const e of this.overlayService.api?.getAllWindows() ?? []) {
                e.window.show();
            }
        });
        ipcMain.handle("updateHotkey", () => {
            this.overlayHotKeysService.updateHotKey();
        });
        ipcMain.handle('updateExclusiveOptions', async (sender, options) => {
            this.overlayInputService?.updateExclusiveModeOptions(options);
        });
        ipcMain.handle("EXCLUSIVE_TYPE", async (_rx, type) => {
            if (!this.overlayInputService) return;
            if (type === "customWindow") {
                this.overlayInputService.exclusiveModeAsWindow = true;
            } else {
                this.overlayInputService.exclusiveModeAsWindow = false;
            }
        });
        ipcMain.handle('EXCLUSIVE_BEHAVIOR', async (_rx, behavior) => {
            if (!this.overlayInputService) return;
            if (behavior === "toggle") {
                this.overlayInputService.mode = "toggle";
            } else {
                this.overlayInputService.mode = "auto";
            }
        });
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

        this.osrWindow.overlayWindow?.window.hide();
    }

}