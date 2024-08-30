import type { OverlayService } from "./services/overlay.service";
import type { MainWindowController } from "./controllers/main-window.controller";
import type { GameInfo, GameLaunchEvent } from "@overwolf/ow-electron-packages-types";
import { kGameIds } from "@overwolf/ow-electron-packages-types/game-list";

export class Application {
    constructor(
        private readonly overlayService: OverlayService,
        private readonly mainWindowController: MainWindowController
    ) {
        overlayService.on("ready", this.onOverlayServiceReady);
        overlayService.on("injection-decision-handling", (ev: GameLaunchEvent, _info: GameInfo) => {
            ev.inject();
        });
    }

    onOverlayServiceReady = () => {
        this.overlayService.registerToGames([
            kGameIds.Rainbow6Siege
        ])
    }
    run = () => {
        this.mainWindowController.createAndShow();
    }
}