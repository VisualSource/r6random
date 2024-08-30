import type { overwolf } from "@overwolf/ow-electron";
import type { IOverwolfOverlayApi } from "@overwolf/ow-electron-packages-types";
import { app as electron } from "electron";

export const app = electron as overwolf.OverwolfApp;

export const pkg = app.overwolf.packages as typeof app.overwolf.packages & { overlay: IOverwolfOverlayApi }