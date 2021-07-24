import { createFft } from './Fft';
import { Spectrometer, SpectrometerFrequenciesOptions } from './Spectrometer';
import { startAnimation, AnimationSubscription } from '../Rendering/Animation';
import { runPromiseWorker } from '../Workers/PromiseWorker';

export const createFrequenciesView = (
	buffer: ArrayBufferLike,
	windowSize: number,
	count: number,
) => {
	const fftSize = windowSize / 2;
	const fftStep = fftSize * Uint8Array.BYTES_PER_ELEMENT;
	const result: Uint8Array[] = [];
	let offset = 0;
	for (let i = 0; i < count; i++) {
		const array = new Uint8Array(buffer, offset, fftSize);
		result.push(array);
		offset += fftStep;
	}
	return result;
};

export type SpectrumOptions = {
	windowSize: number;
	count: number;
};
export const createSpectrumHandlers = () => {
	type SpectrumState = SpectrumOptions & {
		fft: Spectrometer;
		frequencies: Uint8Array[];
		raw: Uint8Array;
		result: Uint8Array;
	};
	let state: SpectrumState | undefined;
	const setup = (options: SpectrumOptions) => {
		const { windowSize, count } = options;
		const fftSize = windowSize / 2;
		const fft = createFft(windowSize);
		const shared = new SharedArrayBuffer(count * fftSize * Uint8Array.BYTES_PER_ELEMENT);
		const buffer = new ArrayBuffer(count * fftSize * Uint8Array.BYTES_PER_ELEMENT);
		const frequencies = createFrequenciesView(buffer, windowSize, count);
		const raw = new Uint8Array(buffer);
		const result = new Uint8Array(shared);
		state = { windowSize, count, fft, frequencies, raw, result };
		return shared;
	};

	let buffer: Float32Array | undefined;
	const setSoundBuffer = (value: SharedArrayBuffer) => {
		buffer = new Float32Array(value);
	};

	const copy = () => {
		if (!state || !buffer) return;
		const { raw, result } = state;
		result.set(raw);
	};
	const calc = (): void => {
		if (!state || !buffer) return;
		const { windowSize, count, fft, frequencies } = state;
		const step = (buffer.length - windowSize) / (count - 1);
		const options: SpectrometerFrequenciesOptions = {
			offset: 0,
			step,
			count,
		};
		fft.byteFrequencies(buffer, frequencies, options);
		copy();
	};

	let subscription: AnimationSubscription | undefined;
	const start = () => {
		subscription && subscription.stop();
		subscription = startAnimation(() => calc);
	};
	const stop = () => {
		subscription && subscription.stop();
		subscription = undefined;
	};

	return {
		setup,
		start,
		stop,
		setSoundBuffer,
	};
};

export const runSpectrumWorker = (worker: Worker) => {
	runPromiseWorker(worker, createSpectrumHandlers);
};
