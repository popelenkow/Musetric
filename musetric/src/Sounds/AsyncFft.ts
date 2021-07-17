import { createPromiseWorkerApi } from '../Workers/PromiseWorkerApi';
import { FftAsyncOptions } from './AsyncFftWorker';

export type AsyncFft = {
	setup: (options: FftAsyncOptions) => Promise<SharedArrayBuffer>;
	start: () => Promise<void>;
	stop: () => Promise<void>
	setSoundBuffer: (buffer: SharedArrayBuffer) => Promise<void>
};
const allTypes: (keyof AsyncFft)[] = ['setup', 'start', 'stop', 'setSoundBuffer'];

export const createAsyncFft = (): AsyncFft => {
	const worker = new Worker('musetricAsyncFft.js');
	const api = createPromiseWorkerApi(worker, allTypes);
	const { setup, start, stop, setSoundBuffer } = api;
	return { setup, start, stop, setSoundBuffer };
};
