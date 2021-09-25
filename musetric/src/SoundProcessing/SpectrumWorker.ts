import { createFftRadix4 } from '../Sounds/FftRadix4';
import { Spectrometer, SpectrometerFrequenciesOptions } from '../Sounds/Spectrometer';
import { createAnimation } from '../Rendering/Animation';
import { runPromiseWorker } from '../Workers/PromiseWorker';

export const createFrequenciesView = (
	buffer: ArrayBufferLike,
	windowSize: number,
	count: number,
): Uint8Array[] => {
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
export type SpectrumHandlers = {
	setup: (options: SpectrumOptions) => SharedArrayBuffer;
	start: () => void;
	stop: () => void;
	setSoundBuffer: (value: SharedArrayBuffer) => void;
};
export const createSpectrumHandlers = (): SpectrumHandlers => {
	type SpectrumState = SpectrumOptions & {
		spectrometer: Spectrometer;
		frequencies: Uint8Array[];
		raw: Uint8Array;
		result: Uint8Array;
	};
	let state: SpectrumState | undefined;
	const setup = (options: SpectrumOptions) => {
		const { windowSize, count } = options;
		const spectrometerSize = windowSize / 2;
		const spectrometer = createFftRadix4(windowSize);
		const shared = new SharedArrayBuffer(count * spectrometerSize * Uint8Array.BYTES_PER_ELEMENT);
		const buffer = new ArrayBuffer(count * spectrometerSize * Uint8Array.BYTES_PER_ELEMENT);
		const frequencies = createFrequenciesView(buffer, windowSize, count);
		const raw = new Uint8Array(buffer);
		const result = new Uint8Array(shared);
		state = { windowSize, count, spectrometer, frequencies, raw, result };
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
		const { windowSize, count, spectrometer, frequencies } = state;
		const step = (buffer.length - windowSize) / (count - 1);
		const options: SpectrometerFrequenciesOptions = {
			offset: 0,
			step,
			count,
		};
		spectrometer.byteFrequencies(buffer, frequencies, options);
		copy();
	};

	const { start, stop } = createAnimation(() => {
		return {
			onIteration: calc,
		};
	});

	return {
		setup,
		start,
		stop,
		setSoundBuffer,
	};
};

export const runSpectrumWorker = (worker: Worker): void => {
	runPromiseWorker(worker, createSpectrumHandlers);
};
