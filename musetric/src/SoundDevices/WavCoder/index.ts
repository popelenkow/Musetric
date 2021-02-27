import { v4 as uuid } from 'uuid';
import { createWorker, EncodeOptions, WorkerMessage, WavCoderMessage } from './Worker';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResultCallback<T = any> = (result: T) => void;

export type WavCoder = {
	encode: (options: EncodeOptions) => Promise<Blob>;
};

export const createWavCoder = (): WavCoder => {
	const worker = createWorker();

	const postMessage: (message: WorkerMessage) => void = (message) => {
		worker.postMessage(message);
	};

	const callbacks: Record<string, ResultCallback> = {};

	worker.onmessage = (e: MessageEvent<WavCoderMessage>) => {
		const cb = callbacks[e.data.id];
		delete callbacks[e.data.id];
		cb(e.data.result);
	};

	const encode: WavCoder['encode'] = (options) => {
		return new Promise((resolve) => {
			const id = uuid();

			const cb: ResultCallback<Blob> = (result) => {
				resolve(result);
			};
			callbacks[id] = cb;

			postMessage({
				id,
				type: 'encode',
				options,
			});
		});
	};

	const result: WavCoder = {
		encode,
	};
	return result;
};
