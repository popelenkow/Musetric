export const createSoundCircularBuffer = (
	sampleRate: number,
	channelCount: number,
	memorySize = sampleRate * 5,
) => {
	const rawBuffers: SharedArrayBuffer[] = [];
	const buffers: Float32Array[] = [];
	for (let i = 0; i < channelCount; i++) {
		const raw = new SharedArrayBuffer(memorySize * Float32Array.BYTES_PER_ELEMENT);
		rawBuffers[i] = raw;
		buffers[i] = new Float32Array(raw);
	}
	const soundBuffer = {
		sampleRate,
		channelCount,
		memorySize,
		setCursor: () => {},
		buffers,
		rawBuffers,
		push: (chunk: Float32Array[]) => {
			for (let i = 0; i < channelCount; i++) {
				if (memorySize > chunk[i].length) {
					const newSize = chunk[i].length;
					const oldSize = memorySize - newSize;
					buffers[i].copyWithin(0, newSize);
					buffers[i].set(chunk[i], oldSize);
				}
			}
		},
	};
	return soundBuffer;
};

export type SoundCircularBuffer = ReturnType<typeof createSoundCircularBuffer>;
