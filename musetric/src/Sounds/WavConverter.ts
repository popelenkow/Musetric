import { createPromiseWorkerApi } from '../Workers/PromiseWorkerApi';

export type WavConverter = {
	encode: (buffers: Float32Array[], sampleRate: number) => Promise<Blob>;
};
const allTypes: (keyof WavConverter)[] = ['encode'];

export const createWavConverter = (): WavConverter => {
	const worker = new Worker('musetricWavConverter.js');
	const api = createPromiseWorkerApi(worker, allTypes);
	const { encode } = api;
	return { encode };
};
