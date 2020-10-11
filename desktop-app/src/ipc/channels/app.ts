import { ipcMain, ipcRenderer } from 'electron';
import { Locale } from 'musetric/locales';
import { Theme } from 'musetric/themes';
import { Handle, Invoke } from '../types';

export namespace app {
	export type Arg =
		| { type: 'theme', value: Theme }
		| { type: 'locale', value: Locale }
	export const handle: Handle<Arg> = (listener) => ipcMain.handle('app', listener);
	export const invoke: Invoke<Arg> = (arg) => ipcRenderer.invoke('app', arg);
}
