export const createSoundBuffer = (
	sampleRate: number,
	channelCount: number,
	initMemorySize = sampleRate * 2,
) => {
	const rawBuffers: SharedArrayBuffer[] = [];
	const buffers: Float32Array[] = [];
	for (let i = 0; i < channelCount; i++) {
		const raw = new SharedArrayBuffer(initMemorySize * Float32Array.BYTES_PER_ELEMENT);
		rawBuffers[i] = raw;
		buffers[i] = new Float32Array(raw);
	}
	const soundBuffer = {
		sampleRate,
		channelCount,
		memorySize: initMemorySize,
		cursor: 0,
		setCursor: (value: number) => {
			soundBuffer.cursor = value;
		},
		buffers,
		rawBuffers,
		push: (chunk: Float32Array[]) => {
			let { cursor, memorySize } = soundBuffer;
			const chunkSize = chunk[0].length;
			const newSize = cursor + chunkSize;
			if (newSize > memorySize) {
				memorySize = 2 ** Math.ceil(Math.log2(newSize));
				for (let i = 0; i < channelCount; i++) {
					const raw = new SharedArrayBuffer(memorySize * Float32Array.BYTES_PER_ELEMENT);
					const buffer = new Float32Array(raw);
					buffer.set(buffers[i]);
					rawBuffers[i] = raw;
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

export type SoundBuffer = ReturnType<typeof createSoundBuffer>;
