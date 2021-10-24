import { SharedRealArray, createSharedRealArray, viewRealArray } from '../Typed/RealArray';

export type SoundBuffer = {
	readonly sampleRate: number;
	readonly channelCount: number;
	readonly length: number;
	readonly buffers: SharedRealArray<'float32'>[];
	readonly setLength: (length: number) => void;
};
export const createSoundBuffer = (
	sampleRate: number,
	channelCount: number,
	initLength = sampleRate * 2,
): SoundBuffer => {
	const buffers: SharedRealArray<'float32'>[] = [];
	for (let i = 0; i < channelCount; i++) {
		buffers[i] = createSharedRealArray('float32', initLength);
	}

	const soundBuffer = {
		sampleRate,
		channelCount,
		length: initLength,
		buffers,
		setLength: (length: number) => {
			if (length === soundBuffer.length) return;
			const isIncrease = length > soundBuffer.length;
			for (let i = 0; i < channelCount; i++) {
				const buffer = createSharedRealArray('float32', length);
				const old = isIncrease
					? buffers[i].real
					: viewRealArray(buffers[i].type, buffers[i].realRaw, 0, length).real;
				buffer.real.set(old);
				buffers[i] = buffer;
			}
			soundBuffer.length = length;
		},
	};
	return soundBuffer;
};
