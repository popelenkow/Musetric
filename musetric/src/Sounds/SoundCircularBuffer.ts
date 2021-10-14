import { SharedRealArray, createSharedRealArray } from '../Typed/RealArray';

export type SoundCircularBuffer = {
	readonly sampleRate: number;
	readonly channelCount: number;
	readonly length: number;
	readonly buffers: SharedRealArray<'float32'>[];
	readonly push: (chunk: Float32Array[]) => void;
};
export const createSoundCircularBuffer = (
	sampleRate: number,
	channelCount: number,
	length = sampleRate * 5,
): SoundCircularBuffer => {
	const buffers: SharedRealArray<'float32'>[] = [];
	for (let i = 0; i < channelCount; i++) {
		buffers[i] = createSharedRealArray('float32', length);
	}
	const soundBuffer = {
		sampleRate,
		channelCount,
		length,
		buffers,
		push: (chunk: Float32Array[]) => {
			for (let i = 0; i < channelCount; i++) {
				if (length > chunk[i].length) {
					const newSize = chunk[i].length;
					const oldSize = length - newSize;
					buffers[i].real.copyWithin(0, newSize);
					buffers[i].real.set(chunk[i], oldSize);
				}
			}
		},
	};
	return soundBuffer;
};
