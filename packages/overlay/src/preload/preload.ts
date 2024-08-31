import { contextBridge, ipcRenderer } from "electron/renderer";

async function initialize() {
    const el = document.querySelector(".electron-version");
    if (el) {
        el.textContent = `ow-electron ${process.versions.electron}`;
    }
}

contextBridge.exposeInMainWorld("app", {
    onConnected: (callback: () => void) => ipcRenderer.on("overlay-injected", () => callback()),
    onLog: (callback: (...args: unknown[]) => void) => ipcRenderer.on("console-log", (_ev, value) => callback(value)),
    initialize
});

contextBridge.exposeInMainWorld("osr", {
    openOSR: () => ipcRenderer.invoke("createOSR"),
    toggle: () => ipcRenderer.invoke("toggleOSRVisibility"),
    updateHotkey: () => ipcRenderer.invoke("updateHotkey")
});

contextBridge.exposeInMainWorld("overlay", {
    setExclusiveModeType: (mode) => ipcRenderer.invoke("EXCLUSIVE_TYPE", mode),
    setExclusiveModeHotkeyBehavior: (behavior) => ipcRenderer.invoke("EXCLUSIVE_BEHAVIOR", behavior),
    updateExclusiveOptions: (opt) => ipcRenderer.invoke("updateExclusiveOptions", opt)
});