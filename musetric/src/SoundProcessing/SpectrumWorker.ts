import { createFftRadix4 } from '../Sounds/FftRadix4';
import { Spectrometer } from '../Sounds/Spectrometer';
import { createAnimation } from '../Rendering/Animation';
import { runPromiseWorker } from '../Workers/PromiseWorker';
import { viewRealArray, RealArray, createSharedRealArray, SharedRealArray, createRealArray } from '../Typed/RealArray';
import { viewRealArrays } from '../Typed/RealArrays';

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
		const type = 'uint8';
		const fftSize = windowSize / 2;
		const frequencies = viewRealArrays(type, raw.realRaw, {
			offset: 0,
			step: fftSize,
			size: fftSize,
			count,
		});
		state = { windowSize, count, spectrometer, frequencies, raw, result };
		return result.realRaw;
	};

	let buffer: RealArray<'float32'> | undefined;
	const setSoundBuffer = (value: SharedArrayBuffer) => {
		buffer = viewRealArray('float32', value);
	};

	let index = 0;
	const onIteration = (): void => {
		if (!state || !buffer) return;
		const { result, raw, windowSize, count, spectrometer, frequencies } = state;
		const step = (buffer.real.length - windowSize) / (count - 1);
		const inputs = viewRealArrays(buffer.type, buffer.realRaw, {
			offset: 0,
			step,
			size: windowSize,
			count,
		});
		const startAt = new Date().getTime();
		let isEnded = false;
		const canNext = () => {
			if (isEnded) return false;
			const elapsed = new Date().getTime() - startAt;
			isEnded = elapsed > 10;
			return !isEnded;
		};
		let i = index;
		while (i < count && canNext()) {
			spectrometer.byteFrequency(inputs[i], frequencies[i], {});
			i++;
		}
		if (i === count) result.real.set(raw.real);
		index = i % count;
	};

	const { start, stop } = createAnimation(() => ({
		onIteration,
	}));

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
