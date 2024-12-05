import type {
	IOverwolfOverlayApi,
	OverlayBrowserWindow,
	OverlayWindowOptions,
} from "@overwolf/ow-electron-packages-types";
import { kGameIds } from "@overwolf/ow-electron-packages-types/game-list";
import EventEmitter from "node:events";
import log from "electron-log/main";
import { pkg } from "../utils";

export class OverlayService extends EventEmitter {
	private isOverlayReady = false;

	constructor() {
		super();

		pkg.on("crashed", (_event, canRecover) => {
			log.error(`package crashed. canRecover ${canRecover ? "yes" : "no"}`);
		});
		pkg.on("failed-to-initialize", (_event, pkgName) => {
			log.error(`Failed to initialize package ${pkgName}`);
		});
		pkg.on("updated", (_ev, pkgName, version) => {
			log.info(`Updated package ${pkgName} to version ${version}`);
		});
		pkg.on("package-update-pending", (_ev, info) => {
			log.info(
				`The following packages are pending updates: ${info.map((e) => `${e.name}: ${e.version}`).join(", ")}`,
			);
		});
		pkg.on("ready", (_, pkgName, version) => {
			log.info(`Package ${pkgName}:${version} is ready`);
			if (pkgName !== "overlay") return;
			this.isOverlayReady = true;
			this.registerOverlayEvents();
			this.emit("ready");
		});
	}

	public get api(): IOverwolfOverlayApi | null {
		if (!this.isOverlayReady) return null;
		return pkg.overlay;
	}

	public async createNewOsrWindow(
		optins: OverlayWindowOptions,
	): Promise<OverlayBrowserWindow> {
		const overlay = await this.api?.createWindow(optins);
		if (!overlay) throw new Error("Failed to create window");
		return overlay;
	}

	private registerOverlayEvents() {
		const api = this.api;
		if (!api) {
			this.error("No api was ready");
			return;
		}
		api.on("game-launched", (ev, info) => {
			this.log("game launched", info);
			ev.inject();
		});

		api.on("game-injection-error", (info, error) => {
			this.error("game-injection-error", error, info);
		});

		api.registerGames({
			includeUnsupported: true,
			all: true,
			gamesIds: [
				kGameIds.Rainbow6Siege
			],
		});
	}

	private error(message: string, ...args: unknown[]): void {
		try {
			log.error(message, ...args);
			this.emit("error", message, ...args);
		} catch (error) { }
	}
	private log(message: string, ...args: unknown[]): void {
		try {
			log.info(message, ...args);
			this.emit("log", message, args);
		} catch (err) { }
	}
}
