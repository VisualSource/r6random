import { app, Menu, nativeImage, Tray } from "electron";
import { Application } from "./application";
import { OverlayService } from "./services/overlay.service";
import { OverlayHotkeysService } from "./services/overlay-hotkeys.service";
import { OverlayInputService } from "./services/overlay-input.service";
import { OSRWindowController } from "./controllers/osr-window.controller";
import { MainWindowController } from "./controllers/main-window.controller";
import TrayIcon from "./icon";
const bootstrap = () => {
    const overlayService = new OverlayService();
    const overlayHotkeysService = new OverlayHotkeysService(overlayService);
    const inputService = new OverlayInputService(overlayService);

    const createOsrWindowControllerFactory = () => {
        return new OSRWindowController(overlayService);
    }
    const mainWindowController = new MainWindowController(overlayService, overlayHotkeysService, inputService, createOsrWindowControllerFactory);
    return new Application(overlayService, mainWindowController);
}

const sys = bootstrap();
let tray: Tray;
app.whenReady().then(() => {

    const icon = nativeImage.createFromDataURL(TrayIcon);
    tray = new Tray(icon);

    const menu = Menu.buildFromTemplate([
        { label: "Quit", type: "normal", click: () => app.quit() }
    ]);

    tray.setToolTip("R6Random");
    tray.setContextMenu(menu);
    sys.run();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
})