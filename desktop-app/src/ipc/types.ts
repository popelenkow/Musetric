import { IpcMainInvokeEvent, BrowserWindow, IpcRendererEvent } from "electron";

export type Handle<Arg = void, Result = void> = (listener: (event: IpcMainInvokeEvent, arg: Arg) => (Promise<Result>) | (Result)) => void;
export type Invoke<Arg = void, Result = void> = (arg: Arg) => Promise<Result>;
export type On<Arg = void> = (listener: (event: IpcRendererEvent, arg: Arg) => void) => void;
export type Send<Arg = void> = (window: BrowserWindow,  arg: Arg) => void;