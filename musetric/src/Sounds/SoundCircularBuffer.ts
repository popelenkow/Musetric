export type SoundCircularBuffer = {
	readonly sampleRate: number;
	readonly channelCount: number;
	readonly length: number;
	readonly setCursor: () => void;
	readonly buffers: Float32Array[];
	readonly rawBuffers: SharedArrayBuffer[];
	readonly push: (chunk: Float32Array[]) => void;
};
export const createSoundCircularBuffer = (
	sampleRate: number,
	channelCount: number,
	length = sampleRate * 5,
): SoundCircularBuffer => {
	const rawBuffers: SharedArrayBuffer[] = [];
	const buffers: Float32Array[] = [];
	for (let i = 0; i < channelCount; i++) {
		const raw = new SharedArrayBuffer(length * Float32Array.BYTES_PER_ELEMENT);
		rawBuffers[i] = raw;
		buffers[i] = new Float32Array(raw);
	}
	const soundBuffer = {
		sampleRate,
		channelCount,
		length,
		setCursor: () => { },
		buffers,
		rawBuffers,
		push: (chunk: Float32Array[]) => {
			for (let i = 0; i < channelCount; i++) {
				if (length > chunk[i].length) {
					const newSize = chunk[i].length;
					const oldSize = length - newSize;
					buffers[i].copyWithin(0, newSize);
					buffers[i].set(chunk[i], oldSize);
				}
			}
		},
	};
	return soundBuffer;
};
