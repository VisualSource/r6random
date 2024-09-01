import { contextBridge, ipcRenderer } from "electron/renderer";

contextBridge.exposeInMainWorld("app", {
	quit: () => ipcRenderer.invoke("OSR::quit"),
	minimize: () => ipcRenderer.invoke("OSR::minimize"),
});
