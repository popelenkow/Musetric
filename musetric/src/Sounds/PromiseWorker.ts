/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { v4 as uuid } from 'uuid';

/** [id, type, args] */
export type PromiseWorkerRequest = [string, string, ...any[]];
/** [id, type, args] */
export type PromiseWorkerResponse = [string, string, any];
export type PromiseWorkerHandlers = Record<string, (...args: any[]) => any>;
export type PromiseWorkerApi = Record<string, (...args: any[]) => Promise<any>>;

export function promiseWorkerFunction(
	self: Worker, createHandlers: () => PromiseWorkerHandlers,
): void {
	const handlers = createHandlers();
	self.onmessage = (e: MessageEvent<PromiseWorkerRequest>) => {
		const postMessage = (message: PromiseWorkerResponse) => {
			self.postMessage(message);
		};
		const [id, type, ...args] = e.data;
		const result = handlers[type](...args);
		postMessage([id, type, result]);
	};
}

/*
https://stackoverflow.com/questions/5408406/web-workers-without-a-separate-javascript-file
https://developer.mozilla.org/ru/docs/Web/API/Service_Worker_API/Using_Service_Workers
*/
export const createPromiseWorker = (
	createHandlers: () => PromiseWorkerHandlers,
): Worker => {
	const createHandlersCode = `const createHandlers = ${createHandlers.toString()};`;
	const createWorkerCode = `const createWorker = ${promiseWorkerFunction.toString()};`;
	const runWorkerCode = 'createWorker(this, createHandlers);';
	const code = `${createHandlersCode}\n${createWorkerCode}\n${runWorkerCode}`;
	const workerUrl = URL.createObjectURL(new Blob([code], { type: 'application/javascript' }));
	const worker = new Worker(workerUrl);
	return worker;
};

export const createPromiseWorkerApi = (
	allTypes: string[],
	createHandlers: () => PromiseWorkerHandlers,
): PromiseWorkerApi => {
	const worker = createPromiseWorker(createHandlers);

	const postMessage = (message: PromiseWorkerRequest): void => {
		worker.postMessage(message);
	};
	const callbacks: Record<string, (result: any) => void> = {};

	worker.onmessage = (e: MessageEvent<PromiseWorkerResponse>) => {
		const [id, , result] = e.data;
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
				postMessage([id, type, ...args]);
			});
		};
	});

	return api;
};
