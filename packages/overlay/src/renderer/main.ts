interface WindowExtend {
    app: { initialize: () => void, onLog: (callback: (...args: unknown[]) => void) => void, onConnected: (callback: () => void) => void },
    osr: { openOSR: () => void, toggle: () => void, updateHotkey: () => void },
}
type Win = typeof window & WindowExtend;

(window as Win).app.initialize();
(window as Win).app.onLog((value) => {
    const log = document.getElementById("log");

    const el = document.createElement("p");
    el.textContent = JSON.stringify(value);
    log?.appendChild(el);
});
(window as Win).app.onConnected(() => {
    const el = document.getElementById("loadingBox");
    if (!el) return;
    el.innerHTML = "All Ready";
});

window.addEventListener("DOMContentLoaded", () => {

    document.getElementById('createOSR')?.addEventListener("click", async () => {
        try {
            await (window as Win).osr.openOSR();
        } catch (err) {
            alert(err);
        }
    });
    document.getElementById('visibilityOSR')?.addEventListener("click", async () => {
        try {
            await (window as Win).osr.toggle();
        } catch (error) {
            console.error(error);
        }
    });
    document.getElementById('updateHotkey')?.addEventListener("click", async () => {
        try {
            await (window as Win).osr.updateHotkey();
        } catch (error) {
            console.error(error);
        }
    });

});