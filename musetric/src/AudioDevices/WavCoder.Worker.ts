import * as Types from './WavCoder.Types';

export function workerFunction(self: Worker): void {
	const postMessage: (message: Types.OutMessage) => void = (message) => self.postMessage(message);
	const floatTo16BitPCM = (view: DataView, offset: number, input: Float32Array) => {
		for (let i = 0; i < input.length; i++) {
			const s = Math.max(-1, Math.min(1, input[i]));
			view.setInt16(offset + 2 * i, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
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

	const interleave = (inputL: Float32Array, inputR: Float32Array): Float32Array => {
		const length = inputL.length + inputR.length;
		const result = new Float32Array(length);

		let index = 0;
		let inputIndex = 0;

		while (index < length) {
			result[index++] = inputL[inputIndex];
			result[index++] = inputR[inputIndex];
			inputIndex++;
		}
		return result;
	};

	const encode: Types.MessageHandler<Types.EncodeOptions> = (id, options) => {
		const { sampleRate, buffers } = options;
		const numChannels = buffers.length;
		const interleaved = numChannels === 2
			? interleave(buffers[0], buffers[1])
			: buffers[0];
		const dataView = createDataView(sampleRate, numChannels, interleaved);
		const audioBlob = new Blob([dataView], { type: 'audio/wav' });

		postMessage({ id, type: 'encode', result: audioBlob });
	};

	const api: Record<Types.InMessageType, Types.MessageHandler> = {
		encode,
	};

	const onmessage: ((this: Worker, ev: MessageEvent<Types.InMessage>) => void) | null = (e) => {
		api[e.data.type](e.data.id, e.data.options);
	};
	// eslint-disable-next-line no-param-reassign
	self.onmessage = onmessage;
}

/*
https://stackoverflow.com/questions/5408406/web-workers-without-a-separate-javascript-file
https://developer.mozilla.org/ru/docs/Web/API/Service_Worker_API/Using_Service_Workers
*/
export const createWorker = (): Worker => {
	const workerUrl = URL.createObjectURL(new Blob(['(', workerFunction.toString(), ')(this)'], { type: 'application/javascript' }));
	const worker = new Worker(workerUrl);
	return worker;
};
