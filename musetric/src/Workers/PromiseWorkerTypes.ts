/* eslint-disable @typescript-eslint/no-explicit-any */
export type PromiseWorkerRequest = {
	id: string;
	type: string;
	args: any[];
};
export type PromiseWorkerResponse = {
	id: string;
	type: string;
	result: any;
};
export type PromiseWorkerHandlers = Record<string, (...args: any[]) => any>;
export type PromiseWorkerApi = Record<string, (...args: any[]) => Promise<any>>;
export type PostPromiseWorker = (message: PromiseWorkerResponse) => void;
