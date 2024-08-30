import { pkg } from "../utils";
import EventEmitter from "node:events";
import type { IOverwolfOverlayApi, OverlayBrowserWindow, OverlayWindowOptions } from "@overwolf/ow-electron-packages-types";

export class OverlayService extends EventEmitter {
    private isOverlayReady = false;

    constructor() {
        super();
        this.startOverlayWhenPackageReady();
    }

    public get api(): IOverwolfOverlayApi | null {
        if (!this.isOverlayReady) return null;
        return pkg.overlay;
    }

    public async registerToGames(gamesIds: number[]): Promise<void> {
        await new Promise(ok => setTimeout(ok, 2000));
        await this.api?.registerGames({ gamesIds });
    }

    public async createNewOsrWindow(optins: OverlayWindowOptions): Promise<OverlayBrowserWindow> {
        const overlay = await this.api?.createWindow(optins);
        if (!overlay) throw new Error("Failed to create window");
        return overlay;
    }

    private startOverlayWhenPackageReady() {
        pkg.on("ready", (_, pkgName, version) => {
            if (pkgName !== "overlay") return;
            this.isOverlayReady = true;

            this.log(`overlay package ready: Version ${version}`);
            this.registerOverlayEvents();
            this.emit("ready");
        });
    }

    private registerOverlayEvents() {
        const api = this.api;
        if (!this.api) {
            this.error("No api was ready");
            return;
        }

        api?.removeAllListeners();

        api?.on("game-launched", (ev, info) => {
            this.log("game launched", info);
            if (info.processInfo?.isElevated) {
                return;
            }
            this.emit("injection-decision-handling", ev, info);
        });

        api?.on("game-injection-error", (info, error) => {
            this.error("game-injection-error", error, info);
        });
        api?.on("game-injected", (info) => {
            this.log("new game injected!", info);
        });

        api?.on('game-focus-changed', (window, game, focus) => {
            this.log('game window focus changes', game.name, focus);
        });

        api?.on('game-window-changed', (window, game, reason) => {
            this.log('game window info changed', reason, window);
        });

        api?.on('game-input-interception-changed', (info) => {
            this.log('overlay input interception changed', info);
        });

        api?.on('game-input-exclusive-mode-changed', (info) => {
            this.log('overlay input exclusive mode changed', info);
        });
    }

    private error(message, ...args: unknown[]): void {
        try { this.emit("error", message, ...args); } catch (error) { }
    }
    private log(message: string, ...args: unknown[]): void {
        try { this.emit("log", message, args); } catch (err) { }
    }
}
