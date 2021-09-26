import type { UndefinedObject } from '../Typescript/UndefinedObject';
import type { PromiseObjectApi } from '../Typescript/PromiseObjectApi';
import { createPromiseWorkerApi } from '../Workers/PromiseWorkerApi';
import type { WavConverterWorker } from './WavConverterWorker';

export type WavConverter = PromiseObjectApi<WavConverterWorker>;
const wavConverterTemplate: UndefinedObject<WavConverterWorker> = {
	encode: undefined,
};

export const createWavConverter = (workerUrl: URL | string): WavConverter => {
	const worker = new Worker(workerUrl);
	const api = createPromiseWorkerApi<WavConverterWorker>(worker, wavConverterTemplate);
	return api;
};
