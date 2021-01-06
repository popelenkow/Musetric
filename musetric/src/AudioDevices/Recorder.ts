import { v4 as uuid } from 'uuid';
import * as Types from './Recorder.Types';
import { createWorklet } from './Recorder.Worklet';

export type Recorder = {
	start: () => void;
	stop: () => void;
	clear: () => void;
	getBuffer: () => Promise<Types.GetBufferResult>;
};

// eslint-disable-next-line max-len
export const createRecorder = async (source: MediaStreamAudioSourceNode, cfg?: Types.Config): Promise<Recorder> => {
	let config: Types.Config = {
		bufferLen: 128,
		numChannels: 2,
		mimeType: 'audio/wav',
	};
	config = { ...config, ...cfg };

	const { context } = source;
	const { bufferLen, numChannels } = config;

	// eslint-disable-next-line max-len
	const worklet = await createWorklet(context, { channelCount: numChannels, bufferSize: bufferLen });
	source.connect(worklet);
	// worklet.connect(context.destination);

	const postMessage: (message: Types.InMessage) => void = (message) => {
		worklet.port.postMessage(message);
	};

	const callbacks: Record<string, Types.ResultCallback> = {};

	postMessage({
		id: uuid(),
		type: 'init',
		options: {
			sampleRate: context.sampleRate,
			numChannels: config.numChannels,
		},
	});

	worklet.port.onmessage = (e: MessageEvent<Types.OutMessage>) => {
		const cb = callbacks[e.data.id];
		delete callbacks[e.data.id];
		cb(e.data.result);
	};

	const start: Recorder['start'] = () => {
		postMessage({ id: uuid(), type: 'start' });
	};

	const stop: Recorder['stop'] = () => {
		postMessage({ id: uuid(), type: 'stop' });
	};

	const clear: Recorder['clear'] = () => {
		const id = uuid();
		postMessage({ id, type: 'clear' });
	};

	const getBuffer: Recorder['getBuffer'] = () => {
		return new Promise((resolve) => {
			const id = uuid();
			const cb: Types.ResultCallback<Types.GetBufferResult> = (result) => {
				resolve(result);
			};
			callbacks[id] = cb;
			postMessage({ id, type: 'getBuffer' });
		});
	};

	const result: Recorder = {
		start,
		stop,
		clear,
		getBuffer,
	};
	return result;
};
