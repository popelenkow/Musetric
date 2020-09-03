import { ipcRenderer } from 'electron';
import { On, Send } from '../types';

export namespace onWindow {
	export type Arg = { isMaximized: boolean };
	export const on: On<Arg> = (listener) => ipcRenderer.on('onWindow', listener);
	export const send: Send<Arg> = (window, arg) => window.webContents.send('onWindow', arg);
}
