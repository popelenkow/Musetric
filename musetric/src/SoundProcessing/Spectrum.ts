import type { PromiseObjectApi } from '../Typescript/PromiseObjectApi';
import { createPromiseWorkerApi } from '../Workers/PromiseWorkerApi';
import type { SpectrumWorker } from './SpectrumWorker';

export type Spectrum =
	& PromiseObjectApi<SpectrumWorker>
	& { destroy: () => void };
export const createSpectrum = (workerUrl: URL | string): Spectrum => {
	const worker = new Worker(workerUrl);
	const request = createPromiseWorkerApi<SpectrumWorker, unknown>(worker, {});
	return {
		setup: (...args) => request('setup', args),
		start: (...args) => request('start', args),
		stop: (...args) => request('stop', args),
		emitBufferEvent: (...args) => request('emitBufferEvent', args),
		destroy: () => worker.terminate(),
	};
};
