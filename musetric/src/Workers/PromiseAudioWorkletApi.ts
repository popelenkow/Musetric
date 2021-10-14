/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuid } from 'uuid';
import type { UndefinedObject } from '../Typescript/UndefinedObject';
import type { PromiseObjectApi } from '../Typescript/PromiseObjectApi';
import type { PromiseWorker, PromiseWorkerResponse, PromiseWorkerRequest } from './PromiseWorker';

export const createPromiseAudioWorkletApi = <TWorklet extends PromiseWorker>(
	worklet: AudioWorkletNode,
	templateApi: UndefinedObject<TWorklet>,
): PromiseObjectApi<TWorklet> => {
	const massagePort = worklet.port;
	const postMessage = (message: PromiseWorkerRequest): void => {
		massagePort.postMessage(message);
	};
	const callbacks: Record<string, (result: unknown) => void> = {};

	const api: PromiseObjectApi<PromiseWorker> = {};
	massagePort.onmessage = (e: MessageEvent<PromiseWorkerResponse>) => {
		const { id, type, result } = e.data;
		const isResponse = Object.keys(templateApi).some((x) => x === type);
		if (isResponse) {
			const callback = callbacks[id];
			delete callbacks[id];
			callback(result);
			return;
		}

		const isEvent = Object.keys(api).filter((x) => x).some((x) => x === type);
		if (isEvent) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			api[type](result);
		}
	};

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

	return api as PromiseObjectApi<TWorklet>;
};
