import { v4 as uuid } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageHandler<T = any> = (id: string, options: T) => void;
export type MessageId = { id: string };
export type EncodeOptions = {
	sampleRate: number;
	buffers: Float32Array[]
};
export type WorkerMessage = MessageId & (
	| { type: 'encode', options: EncodeOptions }
);
export type WavCoderMessage = MessageId & (
	| { type: 'encode', result: Blob }
);

export function workerFunction(self: Worker): void {
	const postMessage: (message: WavCoderMessage) => void = (message) => self.postMessage(message);

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

	const encode: MessageHandler<EncodeOptions> = (id, options) => {
		const { sampleRate, buffers } = options;
		const channelCount = buffers.length;
		const interleaved = channelCount === 2
			? interleave(buffers[0], buffers[1])
			: buffers[0];
		const dataView = createDataView(sampleRate, channelCount, interleaved);
		const audioBlob = new Blob([dataView], { type: 'audio/wav' });

		postMessage({ id, type: 'encode', result: audioBlob });
	};

	const api: Record<WorkerMessage['type'], MessageHandler> = {
		encode,
	};

	self.onmessage = (e: MessageEvent<WorkerMessage>) => {
		api[e.data.type](e.data.id, e.data.options);
	};
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

type ResultCallback<T> = (result: T) => void;

export type WavCoder = {
	encode: (options: EncodeOptions) => Promise<Blob>;
};

export const createWavCoder = (): WavCoder => {
	const worker = createWorker();

	const postMessage: (message: WorkerMessage) => void = (message) => {
		worker.postMessage(message);
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const callbacks: Record<string, ResultCallback<any>> = {};

	worker.onmessage = (e: MessageEvent<WavCoderMessage>) => {
		const cb = callbacks[e.data.id];
		delete callbacks[e.data.id];
		cb(e.data.result);
	};

	const encode: WavCoder['encode'] = (options) => {
		return new Promise((resolve) => {
			const id = uuid();

			const cb: ResultCallback<Blob> = (result) => {
				resolve(result);
			};
			callbacks[id] = cb;

			postMessage({
				id,
				type: 'encode',
				options,
			});
		});
	};

	const result: WavCoder = {
		encode,
	};
	return result;
};
