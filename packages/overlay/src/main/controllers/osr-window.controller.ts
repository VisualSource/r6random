import type { OverlayBrowserWindow, OverlayWindowOptions } from "@overwolf/ow-electron-packages-types";
import type { OverlayService } from "../services/overlay.service";
import path from "node:path";
import { ipcMain } from "electron/main";

export class OSRWindowController {
    public overlayWindow: OverlayBrowserWindow | null = null;

    constructor(private readonly overlayService: OverlayService) { }

    quit() {
        this.overlayWindow = null;
    }

    show() {
        if (!this.overlayWindow) return;
        this.overlayWindow.window.show();
    }
    hide() {
        if (!this.overlayWindow) return;
        this.overlayWindow.window.hide();
        ipcMain.removeHandler("OSR::quit");
        ipcMain.removeHandler("OSR::minimize")
    }

    public async createAndShow() {
        const opt: OverlayWindowOptions = {
            name: `osrWindow-${Math.floor(Math.random() * 1000)}`,
            height: 800,
            width: 1000,
            show: true,
            transparent: false,
            resizable: false,
            webPreferences: {
                preload: path.join(__dirname, "../preload/osr-preload.js"),
                devTools: false,
                nodeIntegration: false,
                contextIsolation: false
            }
        }

        opt.x = 100;
        opt.y = 50;

        this.overlayWindow = await this.overlayService.createNewOsrWindow(opt);

        this.registerToIpc();
        this.registerToWindowEvents();

        await this.overlayWindow?.window.loadFile(path.join(__dirname, "../renderer/osr.html"))  /*loadURL("http://192.168.1.10:5173/")*/;
        this.overlayWindow?.window.show();
    }

    registerToIpc() {
        ipcMain.handle("OSR::minimize", () => {
            this.hide();
        });
        ipcMain.handle("OSR::quit", () => {
            this.quit();
        });
    }
    registerToWindowEvents() {
        const win = this.overlayWindow?.window;
        win?.on("closed", () => {
            this.overlayWindow = null;
            console.log("osr window closed");
        });
    }
}