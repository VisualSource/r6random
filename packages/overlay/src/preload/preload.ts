import { contextBridge, ipcRenderer } from "electron/renderer";
import log from "electron-log/renderer";
import { version } from "../../package.json";

async function getAppVersion() {
	return version;
}
const onReady = (callback: () => void) => {
	ipcRenderer.on("overlay-ready", () => callback());
};

contextBridge.exposeInMainWorld("app", {
	getCurrentHotKey: () => ipcRenderer.invoke("getCurrentHotKey"),
	onReady,
	getAppVersion,
	log: (type: "info" | "error", message: string) => {
		switch (type) {
			case "info":
				log.info(message);
				break;
			case "error":
				log.error(message);
				break;
		}
	},
});

contextBridge.exposeInMainWorld("osr", {
	openOSR: () => ipcRenderer.invoke("createOSR"),
	toggle: () => ipcRenderer.invoke("toggleOSRVisibility"),
	updateHotkey: (mod: string, key: string) =>
		ipcRenderer.invoke("updateHotkey", { mod, key }),
});
