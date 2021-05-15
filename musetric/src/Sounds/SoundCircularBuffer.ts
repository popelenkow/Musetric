export const createSoundCircularBuffer = (
	sampleRate: number,
	channelCount: number,
	memorySize = sampleRate * 5,
) => {
	const buffers: Float32Array[] = [];
	for (let i = 0; i < channelCount; i++) {
		buffers[i] = new Float32Array(memorySize);
	}
	const soundBuffer = {
		sampleRate,
		channelCount,
		memorySize,
		setCursor: () => {},
		buffers,
		push: (chunk: Float32Array[]) => {
			for (let i = 0; i < channelCount; i++) {
				if (memorySize > chunk[i].length) {
					const newSize = chunk[i].length;
					const oldSize = memorySize - newSize;
					const offset = newSize * Float32Array.BYTES_PER_ELEMENT;
					const self = new Float32Array(buffers[i].buffer, offset, oldSize);
					buffers[i].set(self);
					buffers[i].set(chunk[i], oldSize);
				}
			}
		},
	};
	return soundBuffer;
};

export type SoundCircularBuffer = ReturnType<typeof createSoundCircularBuffer>;
