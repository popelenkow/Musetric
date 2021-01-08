import { v4 as uuid } from 'uuid';
import * as Types from './Recorder.Types';
import { createWorklet } from './Recorder.Worklet';

export type Recorder = {
	start: () => void;
	stop: () => void;
	clear: () => void;
	getBuffer: () => Promise<Types.GetBufferResult>;
	subscribe: (subscription: Types.ResultCallback<Types.SubscriptionResult>) => void;
	unsubscribe: () => void;
};

// eslint-disable-next-line max-len
export const createRecorder = async (source: MediaStreamAudioSourceNode, cfg?: Types.Config): Promise<Recorder> => {
	let config: Types.Config = {
		channelCount: 1,
	};
	config = { ...config, ...cfg };

	const { context } = source;
	const { channelCount } = config;

	// eslint-disable-next-line max-len
	const worklet = await createWorklet(context, { channelCount });
	source.connect(worklet);
	// worklet.connect(context.destination);

	const postMessage: (message: Types.InMessage) => void = (message) => {
		worklet.port.postMessage(message);
	};

	const callbacks: Record<string, Types.ResultCallback> = {};
	let subscription: Types.ResultCallback<Types.SubscriptionResult> | undefined;

	postMessage({
		id: uuid(),
		type: 'init',
		options: {
			channelCount,
		},
	});

	worklet.port.onmessage = (e: MessageEvent<Types.OutMessage>) => {
		if (e.data.type === 'subscription') {
			if (!subscription) {
				console.error('Recorder subscription is empty');
				return;
			}
			subscription(e.data.result);
			e.data.result;
			return;
		}
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

	const subscribe = (sub: Types.ResultCallback<Types.SubscriptionResult>) => {
		subscription = sub;
		postMessage({ id: uuid(), type: 'subscribe' });
	};

	const unsubscribe = () => {
		postMessage({ id: uuid(), type: 'unsubscribe' });
		subscription = undefined;
	};

	const result: Recorder = {
		start,
		stop,
		clear,
		getBuffer,
		subscribe,
		unsubscribe,
	};
	return result;
};
