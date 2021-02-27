/* eslint-disable max-len */
import { v4 as uuid } from 'uuid';
import { SoundBuffer } from '..';

export const createRecorderApi = (mediaStream: MediaStream, messagePort: MessagePort, soundBuffer: SoundBuffer) => {
	const onStartCbs: Record<string, () => void> = {};
	const onStopCbs: Record<string, () => void> = {};
	let onChunkCb: ((result: Float32Array[]) => void) | undefined;

	const callbacks = {
		onStart: (id: string): void => {
			onStartCbs[id]();
			delete onStartCbs[id];
		},
		onStop: (id: string): void => {
			onStopCbs[id]();
			delete onStopCbs[id];
		},
		onChunk: (chunk: Float32Array[]): void => {
			soundBuffer.push(chunk);
			onChunkCb && onChunkCb(chunk);
		},
	};

	messagePort.onmessage = (e: MessageEvent<CallbackMessage>) => {
		const [key, ...rest] = e.data;
		// eslint-disable-next-line max-len
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
		(callbacks[key] as any)(...rest);
	};

	const postMessage = (...message: WorkletMessage) => {
		messagePort.postMessage(message);
	};

	const recorder = {
		mediaStream,
		start: (): Promise<void> => {
			return new Promise((resolve) => {
				const id = uuid();
				onStartCbs[id] = () => resolve();
				postMessage('start', id);
			});
		},
		stop: (): Promise<void> => {
			return new Promise((resolve) => {
				const id = uuid();
				onStopCbs[id] = () => resolve();
				postMessage('stop', id);
			});
		},
		subscribe: (onChunk: (result: Float32Array[]) => void) => {
			onChunkCb = onChunk;
		},
		unsubscribe: () => {
			onChunkCb = undefined;
		},
	};
	return { callbacks, recorder };
};

export type Recorder = ReturnType<typeof createRecorderApi>['recorder'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any, max-len
type Message<TObj extends Record<string, (...args: any) => any>, TProp extends keyof TObj> = [TProp, ...Parameters<TObj[TProp]>];
type CallbacksApi = ReturnType<typeof createRecorderApi>['callbacks'];
type CallbackMessage =
	| Message<CallbacksApi, 'onStart'>
	| Message<CallbacksApi, 'onStop'>
	| Message<CallbacksApi, 'onChunk'>;

type State = {
	isRecording: boolean;
};

function createRecorderWorkletApi(messagePort: MessagePort) {
	const postMessage = (...message: CallbackMessage) => {
		messagePort.postMessage(message);
	};

	const state: State = {
		isRecording: false,
	};

	const api = {
		process(inputRaw: Float32Array[]) {
			const { isRecording } = state;
			if (isRecording) {
				const input = inputRaw.map(x => x.map(y => y));
				postMessage('onChunk', input);
			}
		},
		start: (id: string) => {
			state.isRecording = true;
			postMessage('onStart', id);
		},
		stop: (id: string) => {
			state.isRecording = false;
			postMessage('onStop', id);
		},
	};
	messagePort.onmessage = (e: MessageEvent<WorkletMessage>) => {
		const [key, ...rest] = e.data;
		// eslint-disable-next-line max-len
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
		(api[key] as any)(...rest);
	};
	return api;
}

type Api = ReturnType<typeof createRecorderWorkletApi>;
type WorkletMessage =
	| Message<Api, 'start'>
	| Message<Api, 'stop'>;

/*
https://github.com/microsoft/TypeScript/issues/28308
https://stackoverflow.com/questions/61089091/is-it-possible-to-get-raw-values-of-audio-data-using-mediarecorder
https://www.html5rocks.com/en/tutorials/getusermedia/intro/#toc-webaudio-api
*/
export interface AudioWorkletProcessorType {
	readonly port: MessagePort;
	// eslint-disable-next-line max-len
	process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
}

declare const AudioWorkletProcessor: {
	prototype: AudioWorkletProcessorType;
	new(options?: AudioWorkletNodeOptions): AudioWorkletProcessorType;
};

export type ProcessorCtor = (new (options?: AudioWorkletNodeOptions) => AudioWorkletProcessorType)
& { parameterDescriptors?: AudioParamDescriptor[] };

declare function registerProcessor(name: string, processorCtor: ProcessorCtor): void;

function runRecorderWorklet(): void {
	class RecorderProcessor extends AudioWorkletProcessor {
		public static parameterDescriptors = [];

		api = createRecorderWorkletApi(this.port);

		process([inputRaw]: Float32Array[][]): boolean {
			this.api.process(inputRaw);
			return true;
		}
	}

	registerProcessor('recorder-worklet', RecorderProcessor);
}

// eslint-disable-next-line max-len
const createRecorderWorklet = async (context: BaseAudioContext, channelCount: number): Promise<AudioWorkletNode> => {
	const workletUrl = URL.createObjectURL(new Blob([createRecorderWorkletApi.toString(), ';', '(', runRecorderWorklet.toString(), ')()'], { type: 'application/javascript' }));
	await context.audioWorklet.addModule(workletUrl);
	const worklet = new AudioWorkletNode(context, 'recorder-worklet', { channelCount, numberOfOutputs: 0, numberOfInputs: 1 });
	return worklet;
};

export const createRecorder = async (audioContext: AudioContext, soundBuffer: SoundBuffer): Promise<Recorder> => {
	const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
	const source = audioContext.createMediaStreamSource(mediaStream);
	const worklet = await createRecorderWorklet(source.context, soundBuffer.channelCount);
	source.connect(worklet);
	return createRecorderApi(mediaStream, worklet.port, soundBuffer).recorder;
};
