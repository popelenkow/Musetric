export type SoundBuffer = {
	readonly sampleRate: number;
	readonly channelCount: number;
	readonly memorySize: number;
	cursor: number;
	readonly buffers: Float32Array[];
	readonly push: (chunk: Float32Array[]) => void;
};

export const createSoundBuffer = (
	sampleRate: number,
	channelCount: number,
	initMemorySize = 32768,
): SoundBuffer => {
	const buffers: Float32Array[] = [];
	for (let i = 0; i < channelCount; i++) {
		buffers[i] = new Float32Array(initMemorySize);
	}
	const soundBuffer = {
		sampleRate,
		channelCount,
		memorySize: initMemorySize,
		cursor: 0,
		buffers,
		push: (chunk: Float32Array[]) => {
			let { cursor, memorySize } = soundBuffer;
			const chunkSize = chunk[0].length;
			const newSize = cursor + chunkSize;
			if (newSize > memorySize) {
				memorySize = 2 ** Math.ceil(Math.log2(newSize));
				for (let i = 0; i < channelCount; i++) {
					const buffer = new Float32Array(memorySize);
					buffer.set(buffers[i]);
					buffers[i] = buffer;
				}
			}
			for (let i = 0; i < channelCount; i++) {
				buffers[i].set(chunk[i], cursor);
			}
			cursor += chunkSize;
			soundBuffer.cursor = cursor;
			soundBuffer.memorySize = memorySize;
		},
	};
	return soundBuffer;
};

export type SoundFixedQueue = {
	readonly sampleRate: number;
	readonly channelCount: number;
	readonly memorySize: number;
	readonly buffers: Float32Array[];
	readonly push: (chunk: Float32Array[]) => void;
};

export const createSoundFixedQueue = (
	sampleRate: number,
	channelCount: number,
	memorySize = sampleRate * 5,
): SoundFixedQueue => {
	const buffers: Float32Array[] = [];
	for (let i = 0; i < channelCount; i++) {
		buffers[i] = new Float32Array(memorySize);
	}
	const soundBuffer = {
		sampleRate,
		channelCount,
		memorySize,
		buffers,
		push: (chunk: Float32Array[]) => {
			for (let i = 0; i < channelCount; i++) {
				const size = Math.min(memorySize, chunk[i].length);
				const buffer = buffers[i];
				const offset = memorySize - size;
				for (let j = 0; j < offset; j++) {
					buffer[j] = buffer[j + size];
				}
				for (let j = 0; j < size; j++) {
					buffer[j + offset] = chunk[i][j];
				}
			}
		},
	};
	return soundBuffer;
};
