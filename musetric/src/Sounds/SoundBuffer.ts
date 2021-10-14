import { SharedRealArray, createSharedRealArray } from '../Typed/RealArray';
import { createCursor, Cursor } from './Cursor';

export type SoundBuffer = {
	readonly sampleRate: number;
	readonly channelCount: number;
	readonly length: number;
	readonly cursor: Cursor;
	readonly buffers: SharedRealArray<'float32'>[];
	readonly push: (chunk: Float32Array[]) => void;
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
	const cursor = createCursor();

	const soundBuffer = {
		sampleRate,
		channelCount,
		length: initLength,
		cursor,
		buffers,
		push: (chunk: Float32Array[]) => {
			let { length } = soundBuffer;
			const chunkSize = chunk[0].length;
			const cur = cursor.get();
			const newSize = cur + chunkSize;
			if (newSize > length) {
				length = 2 ** Math.ceil(Math.log2(newSize));
				for (let i = 0; i < channelCount; i++) {
					const buffer = createSharedRealArray('float32', length);
					buffer.real.set(buffers[i].real);
					buffers[i] = buffer;
				}
			}
			for (let i = 0; i < channelCount; i++) {
				buffers[i].real.set(chunk[i], cur);
			}
			cursor.set(cur + chunkSize, 'process');
			soundBuffer.length = length;
		},
	};
	return soundBuffer;
};
