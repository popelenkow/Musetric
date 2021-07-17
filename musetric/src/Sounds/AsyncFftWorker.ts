import { Fft, createFft, mapAmplitudeToBel } from './Fft';
import { startAnimation, AnimationSubscription } from '../Rendering/Animation';
import { runPromiseWorker } from '../Workers/PromiseWorker';

export const createFrequenciesView = (
	buffer: ArrayBufferLike,
	windowSize: number,
	fftCount: number,
) => {
	const fftSize = windowSize / 2;
	const fftStep = fftSize * Float32Array.BYTES_PER_ELEMENT;
	const result: Float32Array[] = [];
	let offset = 0;
	for (let i = 0; i < fftCount; i++) {
		const array = new Float32Array(buffer, offset, fftSize);
		result.push(array);
		offset += fftStep;
	}
	return result;
};

export type FftAsyncOptions = {
	windowSize: number;
	fftCount: number;
};
export const createAsyncFftHandlers = () => {
	type FftAsyncState = FftAsyncOptions & {
		fft: Fft;
		frequencies: Float32Array[];
		raw: Float32Array;
		result: Float32Array;
	};
	let state: FftAsyncState | undefined;
	const setup = (options: FftAsyncOptions) => {
		const { windowSize, fftCount } = options;
		const fftSize = windowSize / 2;
		const fft = createFft(windowSize);
		const shared = new SharedArrayBuffer(fftCount * fftSize * Float32Array.BYTES_PER_ELEMENT);
		const buffer = new ArrayBuffer(fftCount * fftSize * Float32Array.BYTES_PER_ELEMENT);
		const frequencies = createFrequenciesView(buffer, windowSize, fftCount);
		const raw = new Float32Array(buffer);
		const result = new Float32Array(shared);
		state = { ...options, fft, frequencies, raw, result };
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
		const { windowSize, fftCount, fft, frequencies } = state;
		const count = fftCount;
		const step = (buffer.length - windowSize) / (count - 1);
		fft.frequencies(buffer, frequencies, { offset: 0, step, count });
		mapAmplitudeToBel(frequencies);
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

export const runAsyncFftWorker = (worker: Worker) => {
	runPromiseWorker(worker, createAsyncFftHandlers);
};
