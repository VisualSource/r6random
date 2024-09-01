import EventEmitter from "node:events";
import type { OverlayService } from "./overlay.service";
import { pkg } from "../utils";

export class OverlayHotkeysService extends EventEmitter {
	constructor(private overlayService: OverlayService) {
		super();
		overlayService.on("ready", this.installHotKeys);
	}
	private installHotKeys = () => {
		pkg.overlay.hotkeys.register(
			{
				name: "overlayToggle",
				keyCode: 82, // r
				modifiers: {
					ctrl: true,
				},
				passthrough: true,
			},
			(hotkey, state) => {
				this.log(`on hotkey: '${hotkey.name}'`, state);
				if (state === "pressed") {
					this.emit("hotkey::overlayToggle");
				}
			},
		);
	};

	public getCurrentHotKey(): { mod: string; key: string } | null {
		const hotkey = pkg.overlay.hotkeys
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
		const hotkey = pkg.overlay.hotkeys
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
		pkg.overlay.hotkeys.update(hotkey);
	}

	private log(message: string, ...args: unknown[]) {
		this.emit("log", message, ...args);
	}
}
