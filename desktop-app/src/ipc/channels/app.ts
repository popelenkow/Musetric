import { ipcMain, ipcRenderer } from 'electron';
import { Types } from 'musetric';
import { Handle, Invoke } from '../types';

export type Arg =
	| { type: 'theme'; value: Types.Theme }
	| { type: 'locale'; value: Types.Locale };
export const handle: Handle<Arg> = (listener) => ipcMain.handle('app', listener);
export const invoke: Invoke<Arg> = (arg) => ipcRenderer.invoke('app', arg);
