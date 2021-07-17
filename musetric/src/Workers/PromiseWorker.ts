/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PromiseWorkerRequest, PromiseWorkerHandlers, PostPromiseWorker } from './PromiseWorkerTypes';

export const runPromiseWorker = (
	worker: Worker,
	createHandlers: (post: PostPromiseWorker) => PromiseWorkerHandlers,
): void => {
	const post: PostPromiseWorker = (message) => {
		worker.postMessage(message);
	};

	const handlers = createHandlers(post);
	worker.onmessage = (e: MessageEvent<PromiseWorkerRequest>) => {
		const { id, type, args } = e.data;
		const result = handlers[type](...args);
		post({ id, type, result });
	};
};
