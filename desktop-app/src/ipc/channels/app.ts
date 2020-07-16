import { Locale } from "../../locale"
import { Theme } from "../../theme"
import { Handle, Invoke } from "../types";
import { ipcMain, ipcRenderer } from "electron";

export namespace app {
	export type Arg =
		| { type: 'theme', theme: Theme }
		| { type: 'locale', locale: Locale }
	export const handle: Handle<Arg> = (listener) => ipcMain.handle('app', listener);
	export const invoke: Invoke<Arg> = (arg) => ipcRenderer.invoke('app', arg);
}