import { createSoundBuffer, SoundBuffer } from './SoundBuffer';
import { createCursor, Cursor } from './Cursor';
import { createEventEmitter, EventEmitter } from './EventEmitter';

export type SoundBufferEvent =
	| { type: 'newBuffer'; }
	| { type: 'invalidate'; from: number; to: number; }
	| { type: 'shift'; from: number; to: number; offset: number; };

const add = (
	soundBuffer: SoundBuffer,
	on: EventEmitter<SoundBufferEvent>,
	chunk: Float32Array[],
	cursor: number,
) => {
	const { length, channelCount, buffers } = soundBuffer;
	const chunkSize = chunk[0].length;
	const newSize = cursor + chunkSize;
	const isNewBuffer = newSize > length;
	if (isNewBuffer) {
		const newLength = 2 ** Math.ceil(Math.log2(newSize));
		soundBuffer.setLength(newLength);
	}
	for (let i = 0; i < channelCount; i++) {
		buffers[i].real.set(chunk[i], cursor);
	}
	const event: SoundBufferEvent = isNewBuffer
		? { type: 'newBuffer' }
		: { type: 'invalidate', from: cursor, to: newSize };
	on.emit(event);
};
const overwrite = (
	soundBuffer: SoundBuffer,
	on: EventEmitter<SoundBufferEvent>,
	chunk: Float32Array[],
) => {
	const { length, channelCount, buffers } = soundBuffer;
	const chunkLength = chunk[0].length;
	const isNotOvercome = length > chunkLength;
	const newSize = chunkLength;
	const oldSize = length - newSize;
	if (isNotOvercome) {
		for (let i = 0; i < channelCount; i++) {
			buffers[i].real.copyWithin(0, newSize);
			buffers[i].real.set(chunk[i], oldSize);
		}
		on.emit({ type: 'shift', from: newSize, to: length, offset: -newSize });
	}
};

export type SoundBufferManager = {
	readonly soundBuffer: SoundBuffer;
	readonly soundCircularBuffer: SoundBuffer;
	readonly on: EventEmitter<SoundBufferEvent>;
	readonly onCircular: EventEmitter<SoundBufferEvent>;
	readonly cursor: Cursor;
	readonly push: (chunk: Float32Array[], type: 'recording' | 'live' | 'file') => void;
};
export const createSoundBufferManager = (
	sampleRate: number,
	channelCount: number,
): SoundBufferManager => {
	const soundBuffer = createSoundBuffer(sampleRate, channelCount);
	const soundCircularBuffer = createSoundBuffer(sampleRate, channelCount, sampleRate * 5);
	const on = createEventEmitter<SoundBufferEvent>();
	const onCircular = createEventEmitter<SoundBufferEvent>();
	const cursor = createCursor();

	const push: SoundBufferManager['push'] = (chunk, type) => {
		const chunkSize = chunk[0].length;
		if (type !== 'live') {
			const cursorValue = cursor.get();
			add(soundBuffer, on, chunk, cursorValue);
			cursor.set(cursorValue + chunkSize, 'process');
		}
		if (type !== 'file') {
			overwrite(soundCircularBuffer, onCircular, chunk);
		}
	};

	return {
		soundBuffer,
		soundCircularBuffer,
		on,
		onCircular,
		cursor,
		push,
	};
};
