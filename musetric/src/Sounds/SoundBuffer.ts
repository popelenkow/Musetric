import { SharedRealArray, createSharedRealArray, viewRealArray } from '../TypedArray/RealArray';

export type SoundBuffer = {
	readonly sampleRate: number,
	readonly channelCount: number,
	readonly length: number,
	readonly buffers: SharedRealArray<'float32'>[],
	readonly setLength: (length: number) => void,
};
export const createSoundBuffer = (
	sampleRate: number,
	channelCount: number,
	initLength = sampleRate * 2,
): SoundBuffer => {
	let buffers: SharedRealArray<'float32'>[] = [];
	for (let i = 0; i < channelCount; i++) {
		buffers[i] = createSharedRealArray('float32', initLength);
	}
	let length = initLength;

	const soundBuffer: SoundBuffer = {
		sampleRate,
		channelCount,
		get length() {
			return length;
		},
		get buffers() {
			return buffers;
		},
		setLength: (newLength) => {
			if (newLength === soundBuffer.length) return;
			const isIncrease = newLength > soundBuffer.length;
			const newBuffers: SharedRealArray<'float32'>[] = [];
			for (let i = 0; i < channelCount; i++) {
				const newBuffer = createSharedRealArray('float32', newLength);
				const old = isIncrease
					? buffers[i].real
					: viewRealArray(buffers[i].type, buffers[i].realRaw, 0, newLength).real;
				newBuffer.real.set(old);
				newBuffers[i] = newBuffer;
			}
			length = newLength;
			buffers = newBuffers;
		},
	};
	return soundBuffer;
};
