export type SoundBuffer = {
	readonly sampleRate: number;
	readonly channelCount: number;
	readonly soundSize: number;
	readonly memorySize: number;
	readonly buffers: Float32Array[];
	readonly getDuration: () => number;
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
		soundSize: 0,
		buffers,
		getDuration: () => soundBuffer.soundSize / sampleRate,
		push: (chunk: Float32Array[]) => {
			let { soundSize, memorySize } = soundBuffer;
			const chunkSize = chunk[0].length;
			const newSize = soundSize + chunkSize;
			if (newSize > memorySize) {
				memorySize = 2 ** Math.ceil(Math.log2(newSize));
				for (let i = 0; i < channelCount; i++) {
					const buffer = new Float32Array(memorySize);
					buffer.set(buffers[i]);
					buffers[i] = buffer;
				}
			}
			for (let i = 0; i < channelCount; i++) {
				buffers[i].set(chunk[i], soundSize);
			}
			soundSize += chunkSize;
			soundBuffer.soundSize = soundSize;
			soundBuffer.memorySize = memorySize;
		},
	};
	return soundBuffer;
};
