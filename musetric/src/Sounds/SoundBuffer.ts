export type SoundBuffer = {
	readonly sampleRate: number;
	readonly channelCount: number;
	readonly length: number;
	readonly cursor: number;
	readonly setCursor: (value: number) => void;
	readonly buffers: Float32Array[];
	readonly rawBuffers: SharedArrayBuffer[];
	readonly push: (chunk: Float32Array[]) => void;
};
export const createSoundBuffer = (
	sampleRate: number,
	channelCount: number,
	initLength = sampleRate * 2,
): SoundBuffer => {
	const rawBuffers: SharedArrayBuffer[] = [];
	const buffers: Float32Array[] = [];
	for (let i = 0; i < channelCount; i++) {
		const raw = new SharedArrayBuffer(initLength * Float32Array.BYTES_PER_ELEMENT);
		rawBuffers[i] = raw;
		buffers[i] = new Float32Array(raw);
	}
	const soundBuffer = {
		sampleRate,
		channelCount,
		length: initLength,
		cursor: 0,
		setCursor: (value: number) => {
			soundBuffer.cursor = value;
		},
		buffers,
		rawBuffers,
		push: (chunk: Float32Array[]) => {
			let { cursor, length } = soundBuffer;
			const chunkSize = chunk[0].length;
			const newSize = cursor + chunkSize;
			if (newSize > length) {
				length = 2 ** Math.ceil(Math.log2(newSize));
				for (let i = 0; i < channelCount; i++) {
					const raw = new SharedArrayBuffer(length * Float32Array.BYTES_PER_ELEMENT);
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
			soundBuffer.length = length;
		},
	};
	return soundBuffer;
};
