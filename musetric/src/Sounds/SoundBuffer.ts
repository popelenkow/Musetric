export const createSoundBuffer = (
	sampleRate: number,
	channelCount: number,
	initMemorySize = 32768,
) => {
	const buffers: Float32Array[] = [];
	for (let i = 0; i < channelCount; i++) {
		buffers[i] = new Float32Array(initMemorySize);
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

export type SoundBuffer = ReturnType<typeof createSoundBuffer>;
