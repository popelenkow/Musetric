import { createPromiseWorkerApi } from '../Workers/PromiseWorkerApi';
import { SpectrumOptions } from './SpectrumWorker';

export type Spectrum = {
	setup: (options: SpectrumOptions) => Promise<SharedArrayBuffer>;
	start: () => Promise<void>;
	stop: () => Promise<void>
	setSoundBuffer: (buffer: SharedArrayBuffer) => Promise<void>
};
const allTypes: (keyof Spectrum)[] = ['setup', 'start', 'stop', 'setSoundBuffer'];

export const createSpectrum = (createWorker: () => Worker): Spectrum => {
	const worker = createWorker();
	const api = createPromiseWorkerApi(worker, allTypes);
	const { setup, start, stop, setSoundBuffer } = api;
	return { setup, start, stop, setSoundBuffer };
};
