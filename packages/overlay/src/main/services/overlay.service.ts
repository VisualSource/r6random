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
			this.emit("package-update-pending", info);
		});
		pkg.on("ready", async (_, pkgName, version) => {
			log.info(`Package ${pkgName}:${version} is ready`);
			if (pkgName !== "overlay") return;
			this.isOverlayReady = true;
			await this.registerOverlayEvents();
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

	private async registerOverlayEvents() {
		const api = this.api;
		if (!api) {
			log.error("No api was ready");
			return;
		}
		log.info("registering overlay event");

		// prevent double events in case the package relaunch due crash
		// or update.
		api.removeAllListeners();

		api.on("game-launched", (ev, info) => {
			log.info("game launched", info);

			if (info.processInfo?.isElevated) {
				log.error("Can not inject into elevated processes");
				return;
			}

			ev.inject();
			this.emit("game-launched", ev, info);
		});

		api.on("game-injection-error", (info, error) => {
			log.error("game-injection-error", error, info);
			this.emit("game-injection-error", info, error);
		});

		api.on("game-injected", (info) => {
			log.info("game-injected", info);
			this.emit("game-injected", info);
		});
		api.on("game-exit", (game, was) => {
			log.info("game-exit", game, was);
			this.emit("game-exit", game, was);
		});
		api.on("game-window-changed", (win, info, reason) => {
			log.info("game-window-changed", info, reason);
			this.emit("game-window-changed", win, info, reason);
		});
		api.on("game-input-interception-changed", (info) => {
			log.info("game-input-interception-changed", info);
			this.emit("game-input-interception-changed", info);
		});
		api.on("game-input-exclusive-mode-changed", (info) => {
			log.info("game-input-exclusive-mode-changed", info);
			this.emit("game-input-exclusive-mode-changed", info);
		});

		await new Promise(ok => setTimeout(ok, 2000));

		api.registerGames({
			gamesIds: [
				kGameIds.Rainbow6Siege,
				kGameIds.HELLDIVERS2
			],
		});
	}
}
