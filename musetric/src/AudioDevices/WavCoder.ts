import { v4 as uuid } from 'uuid';
import * as Types from './WavCoder.Types';
import { createWorker } from './WavCoder.Worker';

export type WavCoder = {
	encode: (options: Types.EncodeOptions) => Promise<Types.EncodeResult>;
};

export const createWavCoder = (): WavCoder => {
	const worker = createWorker();

	const callbacks: Record<string, Types.ResultCallback> = {};

	const onmessage: ((this: Worker, ev: MessageEvent<Types.OutMessage>) => void) | null = (e) => {
		const cb = callbacks[e.data.id];
		delete callbacks[e.data.id];
		cb(e.data.result);
	};
	worker.onmessage = onmessage;

	const encode: WavCoder['encode'] = (options) => {
		return new Promise((resolve) => {
			const id = uuid();

			const cb: Types.ResultCallback<Types.EncodeResult> = (result) => {
				resolve(result);
			};
			callbacks[id] = cb;

			worker.postMessage({
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
