import { v4 as uuid } from 'uuid';
import * as Types from './Recorder.Types';
import { createRecorderWorker } from './Recorder.Worker';

export type Recorder = {
	start: () => void;
	stop: () => void;
	clear: () => void;
	getBuffer: () => Promise<Types.GetBufferResult>;
	exportWav: (mimeType?: string) => Promise<Types.ExportWavResult>;
};

export const createRecorder = (source: GainNode, cfg?: Types.Config): Recorder => {
	const worker = createRecorderWorker();

	let config: Types.Config = {
		bufferLen: 4096,
		numChannels: 2,
		mimeType: 'audio/wav',
	};
	config = { ...config, ...cfg };

	let recording = false;

	const callbacks: Record<string, Types.ResultCallback> = {};

	const { context } = source;
	const { bufferLen, numChannels } = config;

	const node = context.createScriptProcessor(bufferLen, numChannels, numChannels);

	node.onaudioprocess = (e) => {
		if (!recording) return;

		const buffer = [];
		for (let channel = 0; channel < config.numChannels; channel++) {
			buffer.push(e.inputBuffer.getChannelData(channel));
		}
		worker.postMessage({
			id: uuid(),
			type: 'record',
			options: { inputBuffer: buffer },
		});
	};

	source.connect(node);
	node.connect(context.destination);

	worker.postMessage({
		id: uuid(),
		type: 'init',
		options: {
			sampleRate: context.sampleRate,
			numChannels: config.numChannels,
		},
	});

	worker.onmessage = (e) => {
		const cb = callbacks[e.data.id];
		delete callbacks[e.data.id];
		cb(e.data.result);
	};

	const start: Recorder['start'] = () => {
		recording = true;
	};

	const stop: Recorder['stop'] = () => {
		recording = false;
	};

	const clear: Recorder['clear'] = () => {
		const id = uuid();
		worker.postMessage({ id, type: 'clear' });
	};

	const getBuffer: Recorder['getBuffer'] = () => {
		return new Promise((resolve) => {
			const id = uuid();
			const cb: Types.ResultCallback<Types.GetBufferResult> = (result) => {
				resolve(result);
			};
			callbacks[id] = cb;
			worker.postMessage({ id, type: 'getBuffer' });
		});
	};

	const exportWav: Recorder['exportWav'] = (mimeTypeRaw) => {
		return new Promise((resolve) => {
			const id = uuid();
			const mimeType = mimeTypeRaw || config.mimeType;
			const cb: Types.ResultCallback<Types.ExportWavResult> = (result) => {
				resolve(result);
			};
			callbacks[id] = cb;

			worker.postMessage({
				id,
				type: 'exportWav',
				options: { mimeType },
			});
		});
	};

	const result: Recorder = {
		start,
		stop,
		clear,
		getBuffer,
		exportWav,
	};
	return result;
};
