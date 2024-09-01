import { contextBridge, ipcRenderer } from "electron/renderer";
import { version } from "../../package.json";

async function getVersionData() {
	const el = document.querySelector(".versions");
	if (el) {
		el.textContent = `Overwolf-Electron: ${process.versions.electron} | R6Random Overlay: ${version}`;
	}
}

contextBridge.exposeInMainWorld("app", {
	getCurrentHotKey: () => ipcRenderer.invoke("getCurrentHotKey"),
	onConnected: (callback: () => void) =>
		ipcRenderer.on("overlay-ready", () => callback()),
	onLog: (callback: (...args: unknown[]) => void) =>
		ipcRenderer.on("console-log", (_ev, value) => callback(value)),
	getVersionData,
});

contextBridge.exposeInMainWorld("osr", {
	openOSR: () => ipcRenderer.invoke("createOSR"),
	toggle: () => ipcRenderer.invoke("toggleOSRVisibility"),
	updateHotkey: (mod: string, key: string) =>
		ipcRenderer.invoke("updateHotkey", { mod, key }),
});
