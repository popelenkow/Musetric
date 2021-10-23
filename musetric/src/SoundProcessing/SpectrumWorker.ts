import { createFftRadix4 } from '../Sounds/FftRadix4';
import { Spectrometer } from '../Sounds/Spectrometer';
import { createAnimation } from '../Rendering/Animation';
import { createTimer } from '../Rendering/Timer';
import { runPromiseWorker } from '../Workers/PromiseWorker';
import { viewRealArray, RealArray, createSharedRealArray, createRealArray } from '../Typed/RealArray';
import { viewRealArrays } from '../Typed/RealArrays';

const flags = {
	invalid: 0,
	ok: 1,
} as const;
type Flag = typeof flags[keyof typeof flags];

export type SpectrumOptions = {
	windowSize: number;
	count: number;
};
export type SpectrumBufferEvent =
	| { type: 'newBuffer'; value: SharedArrayBuffer; }
	| { type: 'invalidate'; from: number; to: number; }
	| { type: 'shift'; from: number; to: number; offset: number };
export type SpectrumWorker = {
	setup: (options: SpectrumOptions) => SharedArrayBuffer;
	start: () => void;
	stop: () => void;
	emitBufferEvent: (event: SpectrumBufferEvent) => void;
};
export const createSpectrumWorker = (): SpectrumWorker => {
	type SpectrumState = SpectrumOptions & {
		spectrometer: Spectrometer;
		raw: RealArray<'uint8'>;
		outputs: RealArray<'uint8'>[];
		outputStats: Flag[];
		draw: () => void;
	};
	let state: SpectrumState | undefined;
	const setup = (options: SpectrumOptions) => {
		const { windowSize, count } = options;
		const spectrometerSize = windowSize / 2;
		const spectrometer = createFftRadix4(windowSize);
		const result = createSharedRealArray('uint8', count * spectrometerSize);
		const raw = createRealArray('uint8', count * spectrometerSize);
		const fftSize = windowSize / 2;
		const outputs = viewRealArrays('uint8', raw.realRaw, {
			offset: 0,
			step: fftSize,
			length: fftSize,
			count,
		});
		const outputStats = Array<Flag>(count).fill(flags.invalid);
		const draw = () => result.real.set(raw.real);
		state = { windowSize, count, raw, spectrometer, outputs, outputStats, draw };
		return result.realRaw;
	};

	let accOffset = 0;
	const shift = (rawFrom: number, rawTo: number, offset: number) => {
		if (!state) return;
		const { raw, windowSize, outputStats, count } = state;
		accOffset += offset;
		const floorOffset = Math.floor(accOffset);
		if (floorOffset !== 0 && floorOffset !== -1) {
			accOffset -= floorOffset;
			const from = Math.floor(rawFrom);
			const to = Math.ceil(rawTo);
			raw.real.copyWithin(windowSize * (floorOffset + from), windowSize * from, windowSize * to);
			for (let i = from; i < to; i++) {
				const newI = i + floorOffset;
				if (newI >= 0 && newI < count) {
					outputStats[newI] = outputStats[i];
				}
			}
			const invalidateFrom = offset < 0 ? to + floorOffset : from;
			const invalidateTo = offset < 0 ? to : from + floorOffset;
			// Hack. The implementation has a bug.
			for (let i = Math.max(0, invalidateFrom - 5); i < Math.min(invalidateTo + 5, count); i++) {
				outputStats[i] = flags.invalid;
			}
		}
	};

	const invalidate = (rawFrom: number, rawTo: number) => {
		if (!state) return;
		const from = Math.floor(rawFrom);
		const to = Math.floor(rawTo);
		const { outputStats } = state;
		for (let i = from; i < to; i++) {
			outputStats[i] = flags.invalid;
		}
	};

	let buffer: RealArray<'float32'> | undefined;
	let inputs: RealArray<'float32'>[] | undefined;
	const setBuffer = (value: SharedArrayBuffer) => {
		if (!state) return;
		const { windowSize, count } = state;
		buffer = viewRealArray('float32', value);
		const step = (buffer.real.length - windowSize) / (count - 1);
		inputs = viewRealArrays(buffer.type, buffer.realRaw, {
			offset: 0,
			step,
			length: windowSize,
			count,
		});
		invalidate(0, count);
	};

	const emitBufferEvent = (event: SpectrumBufferEvent) => {
		if (!state) return;
		const { count } = state;
		const toRenderPoint = (value: number, length: number) => count * (value / length);
		if (event.type === 'newBuffer') setBuffer(event.value);
		if (event.type === 'invalidate') {
			if (!buffer) return;
			const from = toRenderPoint(event.from, buffer.real.length);
			const to = toRenderPoint(event.to, buffer.real.length);
			invalidate(from, to);
		}
		if (event.type === 'shift') {
			if (!buffer) return;
			const from = toRenderPoint(event.from, buffer.real.length);
			const to = toRenderPoint(event.to, buffer.real.length);
			const offset = toRenderPoint(event.offset, buffer.real.length);
			shift(from, to, offset);
		}
	};

	let index = 0;
	const onIteration = (): void => {
		if (!state || !inputs) return;
		const { draw, count, spectrometer, outputs, outputStats } = state;
		const { timeIsUp } = createTimer(10);
		let i = index;
		let isDirty = false;
		while (i < count && !timeIsUp()) {
			if (outputStats[i] !== flags.ok) {
				isDirty = true;
				spectrometer.byteFrequency(inputs[i], outputs[i], {});
				outputStats[i] = flags.ok;
			}
			i++;
		}
		if (isDirty) draw();
		index = i % count;
	};

	const { start, stop } = createAnimation(() => ({
		onIteration,
	}));

	return {
		setup,
		start,
		stop,
		emitBufferEvent,
	};
};

export const runSpectrumWorker = (worker: Worker): void => {
	runPromiseWorker(worker, createSpectrumWorker);
};
