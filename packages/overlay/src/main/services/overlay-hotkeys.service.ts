import EventEmitter from "node:events";
import log from "electron-log/main";
import type { OverlayService } from "./overlay.service";

export class OverlayHotkeysService extends EventEmitter {
	constructor(private overlayService: OverlayService) {
		super();
		overlayService.on("ready", this.installHotKeys);
	}
	private installHotKeys = () => {
		if (!this.overlayService.api) throw new Error("No overlay api is ready!");
		this.overlayService.api.hotkeys.register(
			{
				name: "overlayToggle",
				keyCode: 82, // r
				modifiers: {
					ctrl: true,
				},
				passthrough: true,
			},
			(hotkey, state) => {
				log.info(`on hotkey: '${hotkey.name}'`, state);
				if (state === "pressed") {
					this.emit("hotkey::overlayToggle");
				}
			},
		);
	};

	public getCurrentHotKey(): { mod: string; key: string } | null {
		if (!this.overlayService.api) throw new Error("No overlay api is ready!");

		const hotkey = this.overlayService.api.hotkeys
			.all()
			.find((h) => h.name === "overlayToggle");
		if (!hotkey) return null;

		let mod = "none";
		if (hotkey.modifiers?.ctrl) {
			mod = "ctrl";
		} else if (hotkey.modifiers?.alt) {
			mod = "alt";
		} else if (hotkey.modifiers?.shift) {
			mod = "shift";
		}

		return { key: String.fromCharCode(hotkey?.keyCode ?? 82), mod };
	}

	public updateHotKey(mod: string, key: string) {
		if (!this.overlayService.api) throw new Error("No overlay api is ready!");

		const hotkey = this.overlayService.api.hotkeys
			.all()
			.find((h) => h.name === "overlayToggle");
		if (!hotkey) return;
		const keyCode = key.toUpperCase().charCodeAt(0);
		hotkey.keyCode = keyCode;
		hotkey.modifiers = {
			ctrl: mod === "ctrl",
			alt: mod === "alt",
			shift: mod === "shift",
		};
		this.overlayService.api.hotkeys.update(hotkey);
		log.info(`Updated hot key to: ${mod}-${key}`);
	}
}
