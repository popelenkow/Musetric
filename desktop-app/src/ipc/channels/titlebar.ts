import { Handle, Invoke } from "../types";
import { ipcMain, ipcRenderer } from "electron";

export namespace titlebar {
	export type Arg = 'close' | 'minimize' | 'unmaximize' | 'maximize'
	export const handle: Handle<Arg> = (listener) => ipcMain.handle('titlebar', listener);
	export const invoke: Invoke<Arg> = (arg) => ipcRenderer.invoke('titlebar', arg);
}