/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcMain, ipcRenderer } from 'electron';
import { Handle, Invoke } from '../types';

export const handle: Handle<void, any> = (listener) => ipcMain.handle('pytest', listener);
export const invoke: Invoke<void, any> = (arg) => ipcRenderer.invoke('pytest', arg);
