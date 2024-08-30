import EventEmitter from "node:events";
import { pkg } from "../utils";
import type { OverlayService } from "./overlay.service";

export class OverlayHotkeysService extends EventEmitter {
    constructor(private overlayService: OverlayService) {
        super();
        overlayService.on("ready", this.installHotKeys);
    }
    private installHotKeys = () => {
        pkg.overlay.hotkeys.register({
            name: "showOverlay",
            keyCode: 82, // r
            modifiers: {
                ctrl: true,
            },
            passthrough: true
        }, (hotkey, state) => {
            this.log(`on hotkey: '${hotkey.name}'`, state)
            if (state === "pressed") {
                this.emit("hotkey::showOverlay")
            }
        });
        pkg.overlay.hotkeys.register({
            name: "hideOverlay",
            keyCode: 90, // z
            modifiers: {
                ctrl: true
            },
            passthrough: true
        }, (hotkey, state) => {
            this.log(`on hotkey: '${hotkey.name}'`, state)
            if (state === "pressed") {
                this.emit("hotkey::hideOverlay");
            }
        });
    }

    public updateHotKey() {
        const hotkey = "tabHotKeyPassThrow";
        const key = pkg.overlay.hotkeys.all().find(h => h.name === hotkey);
        if (!key) return;
        key.passthrough = !key.passthrough;
        pkg.overlay.hotkeys.update(key);
    }

    private log(message: string, ...args: unknown[]) {
        this.emit("log", message, ...args);
    }
}