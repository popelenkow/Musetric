import { createFftRadix4 } from '../Sounds/FftRadix4';
import { Spectrometer, SpectrometerFrequenciesOptions } from '../Sounds/Spectrometer';
import { createAnimation } from '../Rendering/Animation';
import { runPromiseWorker } from '../Workers/PromiseWorker';
import { viewRealArrayFromBuffer, RealArray, createSharedRealArray, SharedRealArray, createRealArray } from '../Typed/RealArray';

export const createFrequenciesView = (
	buffer: ArrayBufferLike,
	windowSize: number,
	count: number,
): RealArray<'uint8'>[] => {
	const fftSize = windowSize / 2;
	const fftStep = fftSize * Uint8Array.BYTES_PER_ELEMENT;
	const result: RealArray<'uint8'>[] = [];
	let byteOffset = 0;
	for (let i = 0; i < count; i++) {
		const array = viewRealArrayFromBuffer('uint8', buffer, byteOffset, fftSize);
		result.push(array);
		byteOffset += fftStep;
	}
	return result;
};

export type SpectrumOptions = {
	windowSize: number;
	count: number;
};
export type SpectrumWorker = {
	setup: (options: SpectrumOptions) => SharedArrayBuffer;
	start: () => void;
	stop: () => void;
	setSoundBuffer: (value: SharedArrayBuffer) => void;
};
export const createSpectrumWorker = (): SpectrumWorker => {
	type SpectrumState = SpectrumOptions & {
		spectrometer: Spectrometer;
		frequencies: RealArray<'uint8'>[];
		raw: RealArray<'uint8'>;
		result: SharedRealArray<'uint8'>;
	};
	let state: SpectrumState | undefined;
	const setup = (options: SpectrumOptions) => {
		const { windowSize, count } = options;
		const spectrometerSize = windowSize / 2;
		const spectrometer = createFftRadix4(windowSize);
		const result = createSharedRealArray('uint8', count * spectrometerSize);
		const raw = createRealArray('uint8', count * spectrometerSize);
		const frequencies = createFrequenciesView(raw.realRaw, windowSize, count);
		state = { windowSize, count, spectrometer, frequencies, raw, result };
		return result.realRaw;
	};

	let buffer: RealArray<'float32'> | undefined;
	const setSoundBuffer = (value: SharedArrayBuffer) => {
		buffer = viewRealArrayFromBuffer('float32', value);
	};

	const copy = () => {
		if (!state || !buffer) return;
		const { raw, result } = state;
		result.real.set(raw.real);
	};
	const calc = (): void => {
		if (!state || !buffer) return;
		const { windowSize, count, spectrometer, frequencies } = state;
		const step = (buffer.real.length - windowSize) / (count - 1);
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
	runPromiseWorker(worker, createSpectrumWorker);
};
