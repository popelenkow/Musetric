import { runPromiseWorker } from '../Workers/PromiseWorker';

export type WavConverterWorker = {
	encode: (buffers: Float32Array[], sampleRate: number) => Blob;
};
export const createWavConverterWorker = (): WavConverterWorker => {
	const floatTo16BitPCM = (view: DataView, offset: number, buffer: Float32Array) => {
		let arrayOffset = 0;
		for (let i = 0; i < buffer.length; i++) {
			const s = Math.max(-1, Math.min(1, buffer[i]));
			view.setInt16(offset + arrayOffset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
			arrayOffset += 2;
		}
	};

	const writeString = (view: DataView, offset: number, value: string) => {
		for (let i = 0; i < value.length; i++) {
			view.setUint8(offset + i, value.charCodeAt(i));
		}
	};

	const createDataView = (sampleRate: number, numChannels: number, samples: Float32Array) => {
		const buffer = new ArrayBuffer(44 + samples.length * 2);
		const view = new DataView(buffer);

		/* RIFF identifier */
		writeString(view, 0, 'RIFF');
		/* RIFF chunk length */
		view.setUint32(4, 36 + samples.length * 2, true);
		/* RIFF type */
		writeString(view, 8, 'WAVE');
		/* format chunk identifier */
		writeString(view, 12, 'fmt ');
		/* format chunk length */
		view.setUint32(16, 16, true);
		/* sample format (raw) */
		view.setUint16(20, 1, true);
		/* channel count */
		view.setUint16(22, numChannels, true);
		/* sample rate */
		view.setUint32(24, sampleRate, true);
		/* byte rate (sample rate * block align) */
		view.setUint32(28, sampleRate * 4, true);
		/* block align (channel count * bytes per sample) */
		view.setUint16(32, numChannels * 2, true);
		/* bits per sample */
		view.setUint16(34, 16, true);
		/* data chunk identifier */
		writeString(view, 36, 'data');
		/* data chunk length */
		view.setUint32(40, samples.length * 2, true);

		floatTo16BitPCM(view, 44, samples);

		return view;
	};

	const interleave = (bufferL: Float32Array, bufferR: Float32Array): Float32Array => {
		const length = bufferL.length + bufferR.length;
		const result = new Float32Array(length);

		let index = 0;
		let inputIndex = 0;

		while (index < length) {
			result[index] = bufferL[inputIndex];
			index++;
			result[index] = bufferR[inputIndex];
			index++;
			inputIndex++;
		}
		return result;
	};

	const encode = (buffers: Float32Array[], sampleRate: number) => {
		const channelCount = buffers.length;
		const interleaved = channelCount === 2
			? interleave(buffers[0], buffers[1])
			: buffers[0];
		const dataView = createDataView(sampleRate, channelCount, interleaved);
		const audioBlob = new Blob([dataView], { type: 'audio/wav' });

		return audioBlob;
	};

	return {
		encode,
	};
};

export const runWavConverterWorker = (worker: Worker): void => {
	runPromiseWorker(worker, createWavConverterWorker);
};
