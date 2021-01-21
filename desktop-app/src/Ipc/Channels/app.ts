import { ipcMain, ipcRenderer } from 'electron';
import { Handle, Invoke } from '../Types';

export type Arg =
	| { type: 'theme'; value: string }
	| { type: 'locale'; value: string };
export const handle: Handle<Arg> = (listener) => ipcMain.handle('app', listener);
export const invoke: Invoke<Arg> = (arg) => ipcRenderer.invoke('app', arg);
