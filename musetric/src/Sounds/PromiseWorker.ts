/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { v4 as uuid } from 'uuid';

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

export const runPromiseWorker = (
	worker: Worker,
	createHandlers: (post: PostPromiseWorker) => PromiseWorkerHandlers,
): void => {
	const postMessage: PostPromiseWorker = (message) => {
		worker.postMessage(message);
	};

	const handlers = createHandlers(postMessage);
	worker.onmessage = (e: MessageEvent<PromiseWorkerRequest>) => {
		const { id, type, args } = e.data;
		const result = handlers[type](...args);
		postMessage({ id, type, result });
	};
};

export const createPromiseWorkerApi = (
	worker: Worker,
	allTypes: string[],
): PromiseWorkerApi => {
	const postMessage = (message: PromiseWorkerRequest): void => {
		worker.postMessage(message);
	};
	const callbacks: Record<string, (result: any) => void> = {};

	worker.onmessage = (e: MessageEvent<PromiseWorkerResponse>) => {
		const { id, result } = e.data;
		const callback = callbacks[id];
		delete callbacks[id];
		callback(result);
	};

	const api: Record<string, (...args: any[]) => Promise<any>> = {};
	allTypes.forEach(type => {
		api[type] = (...args) => {
			return new Promise((resolve) => {
				const id = uuid();
				const callback = (result: any) => { resolve(result); };
				callbacks[id] = callback;
				postMessage({ id, type, args });
			});
		};
	});

	return api;
};
