/*
https://stackoverflow.com/questions/61089091/is-it-possible-to-get-raw-values-of-audio-data-using-mediarecorder
https://www.html5rocks.com/en/tutorials/getusermedia/intro/#toc-webaudio-api
*/
import * as Types from './Recorder.Types';

export function recorderWorkerFunction(rawSelf: Types.InWorker): void {
	const self: Types.InWorker = rawSelf;

	const encodeWav = (sampleRate: number, numChannels: number, samples: Float32Array) => {
		const buffer = new ArrayBuffer(44 + samples.length * 2);
		const view = new DataView(buffer);

		const floatTo16BitPCM = (offset: number, input: Float32Array) => {
			for (let i = 0; i < input.length; i++) {
				const s = Math.max(-1, Math.min(1, input[i]));
				view.setInt16(offset + 2 * i, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
			}
		};

		const writeString = (offset: number, value: string) => {
			for (let i = 0; i < value.length; i++) {
				view.setUint8(offset + i, value.charCodeAt(i));
			}
		};

		/* RIFF identifier */
		writeString(0, 'RIFF');
		/* RIFF chunk length */
		view.setUint32(4, 36 + samples.length * 2, true);
		/* RIFF type */
		writeString(8, 'WAVE');
		/* format chunk identifier */
		writeString(12, 'fmt ');
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
		writeString(36, 'data');
		/* data chunk length */
		view.setUint32(40, samples.length * 2, true);

		floatTo16BitPCM(44, samples);

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

	const mergeBuffers = (recBuffers: Float32Array[], recLength: number) => {
		const result = new Float32Array(recLength);
		let offset = 0;
		for (let i = 0; i < recBuffers.length; i++) {
			result.set(recBuffers[i], offset);
			offset += recBuffers[i].length;
		}
		return result;
	};

	const createArray = (length: number): Float32Array[][] => {
		const result: Float32Array[][] = [];
		for (let i = 0; i < length; i++) {
			result[i] = [];
		}
		return result;
	};

	{
		let numChannels = 0;
		let sampleRate = 0;
		let recLength = 0;
		let recBuffers: Float32Array[][] = [];

		const init: Types.MessageHandler<Types.InitOptions> = (_id, options) => {
			sampleRate = options.sampleRate;
			numChannels = options.numChannels;
			recLength = 0;
			recBuffers = createArray(numChannels);
		};

		const clear: Types.MessageHandler<Types.ClearOptions> = () => {
			recLength = 0;
			recBuffers = createArray(numChannels);
		};

		const record: Types.MessageHandler<Types.RecordOptions> = (_id, options) => {
			const { inputBuffer } = options;
			for (let channel = 0; channel < numChannels; channel++) {
				recBuffers[channel].push(inputBuffer[channel]);
			}
			recLength += inputBuffer[0].length;
		};

		const exportWav: Types.MessageHandler<Types.ExportWavOptions> = (id, options) => {
			const { mimeType } = options;
			const buffers = [];
			for (let channel = 0; channel < numChannels; channel++) {
				buffers.push(mergeBuffers(recBuffers[channel], recLength));
			}
			const interleaved = numChannels === 2
				? interleave(buffers[0], buffers[1])
				: buffers[0];
			const dataView = encodeWav(sampleRate, numChannels, interleaved);
			const audioBlob = new Blob([dataView], { type: mimeType });

			self.postMessage({ id, type: 'exportWav', result: audioBlob });
		};

		const getBuffer: Types.MessageHandler<Types.GetBufferOptions> = (id) => {
			const buffers = [];
			for (let channel = 0; channel < numChannels; channel++) {
				buffers.push(mergeBuffers(recBuffers[channel], recLength));
			}
			self.postMessage({ id, type: 'getBuffer', result: buffers });
		};

		const api: Record<Types.InMessageType, Types.MessageHandler> = {
			init,
			clear,
			record,
			exportWav,
			getBuffer,
		};

		self.onmessage = (e) => {
			api[e.data.type](e.data.id, e.data.options);
		};
	}
}

/*
https://stackoverflow.com/questions/5408406/web-workers-without-a-separate-javascript-file
https://developer.mozilla.org/ru/docs/Web/API/Service_Worker_API/Using_Service_Workers
*/
export const createRecorderWorker = (): Types.OutWorker => {
	const workerUrl = URL.createObjectURL(new Blob(['(', recorderWorkerFunction.toString(), ')(this)'], { type: 'application/javascript' }));

	const worker = new Worker(workerUrl);
	return worker;
};
