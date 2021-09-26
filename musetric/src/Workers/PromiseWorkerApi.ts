import { v4 as uuid } from 'uuid';
import type { UndefinedObject } from '../Typescript/UndefinedObject';
import type { PromiseObjectApi } from '../Typescript/PromiseObjectApi';
import type { PromiseWorkerRequest, PromiseWorkerResponse, PromiseWorker } from './PromiseWorker';

export const createPromiseWorkerApi = <TWorker extends PromiseWorker>(
	host: Worker,
	templateApi: UndefinedObject<TWorker>,
): PromiseObjectApi<TWorker> => {
	const postMessage = (message: PromiseWorkerRequest): void => {
		host.postMessage(message);
	};
	const callbacks: Record<string, (result: unknown) => void> = {};

	host.onmessage = (e: MessageEvent<PromiseWorkerResponse>) => {
		const { id, result } = e.data;
		const callback = callbacks[id];
		delete callbacks[id];
		callback(result);
	};

	const api: PromiseObjectApi<PromiseWorker> = {};
	Object.keys(templateApi).forEach((type) => {
		api[type] = (...args) => {
			return new Promise((resolve) => {
				const id = uuid();
				const callback = (result: unknown) => { resolve(result); };
				callbacks[id] = callback;
				postMessage({ id, type, args });
			});
		};
	});

	return api as PromiseObjectApi<TWorker>;
};
