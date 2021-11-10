import type { PromiseObjectApi } from '../Typescript/PromiseObjectApi';
import { createPromiseWorkerApi } from '../Workers/PromiseWorkerApi';
import type { WavConverterWorker } from './WavConverterWorker';

export type WavConverter = PromiseObjectApi<WavConverterWorker>;
export const createWavConverter = (workerUrl: URL | string): WavConverter => {
	const worker = new Worker(workerUrl);
	const request = createPromiseWorkerApi<WavConverterWorker, unknown>(worker, {});
	return {
		encode: (...args) => request('encode', args),
	};
};
