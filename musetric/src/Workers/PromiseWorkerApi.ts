/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { v4 as uuid } from 'uuid';
import { PromiseWorkerRequest, PromiseWorkerResponse, PromiseWorkerApi } from './PromiseWorkerTypes';

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
