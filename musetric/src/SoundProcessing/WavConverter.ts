import { createPromiseWorkerApi } from '../Workers/PromiseWorkerApi';

export type WavConverter = {
	encode: (buffers: Float32Array[], sampleRate: number) => Promise<Blob>;
};
const allTypes: (keyof WavConverter)[] = ['encode'];

export const createWavConverter = (workerUrl: URL | string): WavConverter => {
	const worker = new Worker(workerUrl);
	const api = createPromiseWorkerApi(worker, allTypes);
	const { encode } = api;
	return { encode };
};
