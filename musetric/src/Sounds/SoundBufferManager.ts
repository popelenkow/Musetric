import { createSoundBuffer, SoundBuffer } from './SoundBuffer';
import { createCursor } from './Cursor';
import { createEventEmitter, EventEmitter } from '../Utils/EventEmitter';

export type SoundBufferEvent =
	| { type: 'newBuffer' }
	| { type: 'invalidate', from: number, to: number }
	| { type: 'shift', offset: number };

const add = (
	soundBuffer: SoundBuffer,
	bufferEventEmitter: EventEmitter<SoundBufferEvent>,
	chunks: Float32Array[],
	cursor: number,
): void => {
	const { length, channelCount, buffers } = soundBuffer;
	const chunkSize = chunks[0].length;
	const newSize = cursor + chunkSize;
	const isNewBuffer = newSize > length;
	if (isNewBuffer) {
		const newLength = 2 ** Math.ceil(Math.log2(newSize));
		soundBuffer.setLength(newLength);
	}
	for (let i = 0; i < channelCount; i++) {
		buffers[i].real.set(chunks[i], cursor);
	}
	const event: SoundBufferEvent = isNewBuffer
		? { type: 'newBuffer' }
		: { type: 'invalidate', from: cursor, to: newSize };
	bufferEventEmitter.emit(event);
};
const overwrite = (
	soundBuffer: SoundBuffer,
	bufferEventEmitter: EventEmitter<SoundBufferEvent>,
	chunks: Float32Array[],
): void => {
	const { length, channelCount, buffers } = soundBuffer;
	const chunkLength = chunks[0].length;
	const isNotOvercome = length > chunkLength;
	const newSize = chunkLength;
	const oldSize = length - newSize;
	if (isNotOvercome) {
		for (let i = 0; i < channelCount; i++) {
			buffers[i].real.copyWithin(0, newSize);
			buffers[i].real.set(chunks[i], oldSize);
		}
		bufferEventEmitter.emit({ type: 'shift', offset: -newSize });
	}
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createSoundBufferManager = (
	sampleRate: number,
	channelCount: number,
) => {
	const soundBuffer = createSoundBuffer(sampleRate, channelCount);
	const soundCircularBuffer = createSoundBuffer(sampleRate, channelCount, sampleRate * 5);
	const bufferEventEmitter = createEventEmitter<SoundBufferEvent>();
	const circularBufferEventEmitter = createEventEmitter<SoundBufferEvent>();
	const cursor = createCursor();

	const push = (chunks: Float32Array[], type: 'recording' | 'live' | 'file'): void => {
		const chunkSize = chunks[0].length;
		if (type !== 'live') {
			const cursorValue = cursor.get();
			add(soundBuffer, bufferEventEmitter, chunks, cursorValue);
			cursor.set(cursorValue + chunkSize, 'process');
		}
		if (type !== 'file') {
			overwrite(soundCircularBuffer, circularBufferEventEmitter, chunks);
		}
	};

	return {
		sampleRate,
		channelCount,
		soundBuffer,
		soundCircularBuffer,
		bufferEventEmitter,
		circularBufferEventEmitter,
		cursor,
		push,
	} as const;
};
export type SoundBufferManager = ReturnType<typeof createSoundBufferManager>;
