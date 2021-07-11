import { createPromiseWorkerApi } from '..';

export type WavConverter = {
	encode: (buffers: Float32Array[], sampleRate: number) => Promise<Blob>;
};
const allWavConverterTypes: (keyof WavConverter)[] = ['encode'];

export const createWavConverter = (): WavConverter => {
	const worker = new Worker('musetricWavConverter.js');
	const api = createPromiseWorkerApi(worker, allWavConverterTypes);
	const { encode } = api;
	return { encode };
};
