import type { UndefinedObject } from '../Typescript/UndefinedObject';
import type { PromiseObjectApi } from '../Typescript/PromiseObjectApi';
import { createPromiseWorkerApi } from '../Workers/PromiseWorkerApi';
import type { SpectrumWorker } from './SpectrumWorker';

export type Spectrum = PromiseObjectApi<SpectrumWorker>;
const spectrumTemplate: UndefinedObject<SpectrumWorker> = {
	setup: undefined,
	start: undefined,
	stop: undefined,
	setSoundBuffer: undefined,
};

export const createSpectrum = (workerUrl: URL | string): Spectrum => {
	const worker = new Worker(workerUrl);
	const api = createPromiseWorkerApi<SpectrumWorker>(worker, spectrumTemplate);
	return api;
};
