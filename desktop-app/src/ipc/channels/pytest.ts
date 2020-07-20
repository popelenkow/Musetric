import { Handle, Invoke } from "../types";
import { ipcMain, ipcRenderer } from "electron";

export namespace pytest {
	export const handle: Handle<void, any> = (listener) => ipcMain.handle('pytest', listener);
	export const invoke: Invoke<void, any> = (arg) => ipcRenderer.invoke('pytest', arg);
}