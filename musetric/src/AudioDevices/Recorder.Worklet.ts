import * as Types from './Recorder.Types';

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

type Api = Record<Types.InMessageType, Types.MessageHandler>;
type State = {
	channelCount: number;
	recordLength: number;
	recordBuffers: Float32Array[][];
	isRecording: boolean;
	isSubscribed: boolean;
};
export function workletFunction(): void {
	class RecorderProcessor extends AudioWorkletProcessor {
		public static parameterDescriptors = [];

		api: Api;

		state: State;

		postMessage = (message: Types.OutMessage) => {
			this.port.postMessage(message);
		};

		constructor(options?: AudioWorkletNodeOptions) {
			super(options);
			const [api, state] = this.createApi();

			this.api = api;
			this.state = state;

			this.port.onmessage = (e: MessageEvent<Types.InMessage>) => {
				api[e.data.type](e.data.id, e.data.options);
			};
		}

		process([inputRaw]: Float32Array[][]): boolean {
			const { isRecording, isSubscribed } = this.state;
			if (isRecording) {
				const input = inputRaw.map(x => x.map(y => y));
				for (let channel = 0; channel < this.state.channelCount; channel++) {
					this.state.recordBuffers[channel].push(input[channel]);
				}
				this.state.recordLength += input[0].length;
				if (isSubscribed) {
					this.postMessage({ id: '', type: 'subscription', result: input });
				}
			}
			return true;
		}

		createApi = (): [Api, State] => {
			const mergeBuffers = (recordBuffers: Float32Array[], recordLength: number) => {
				const result = new Float32Array(recordLength);
				let offset = 0;
				for (let i = 0; i < recordBuffers.length; i++) {
					result.set(recordBuffers[i], offset);
					offset += recordBuffers[i].length;
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
				const state: State = {
					channelCount: 0,
					recordLength: 0,
					recordBuffers: [],
					isRecording: false,
					isSubscribed: false,
				};

				const init: Types.MessageHandler<Types.InitOptions> = (_id, options) => {
					state.channelCount = options.channelCount;
					state.recordLength = 0;
					state.recordBuffers = createArray(state.channelCount);
					state.isRecording = false;
				};

				const start: Types.MessageHandler<void> = () => {
					state.isRecording = true;
				};

				const stop: Types.MessageHandler<void> = () => {
					state.isRecording = false;
				};

				const clear: Types.MessageHandler<void> = () => {
					state.recordLength = 0;
					state.recordBuffers = createArray(state.channelCount);
				};

				const getBuffer: Types.MessageHandler<void> = (id) => {
					const buffers = [];
					for (let channel = 0; channel < state.channelCount; channel++) {
						buffers.push(mergeBuffers(state.recordBuffers[channel], state.recordLength));
					}
					this.postMessage({ id, type: 'getBuffer', result: buffers });
				};

				const subscribe: Types.MessageHandler<void> = () => {
					state.isSubscribed = true;
				};

				const unsubscribe: Types.MessageHandler<void> = () => {
					state.isSubscribed = false;
				};

				const api: Api = {
					init,
					clear,
					start,
					stop,
					getBuffer,
					subscribe,
					unsubscribe,
				};
				return [api, state];
			}
		};
	}

	registerProcessor('recorder-worklet', RecorderProcessor);
}

export type WorkletOptions = {
	channelCount: number;
};

// eslint-disable-next-line max-len
export const createWorklet = async (context: BaseAudioContext, options: WorkletOptions): Promise<AudioWorkletNode> => {
	const { channelCount } = options;
	const workletUrl = URL.createObjectURL(new Blob(['(', workletFunction.toString(), ')()'], { type: 'application/javascript' }));
	await context.audioWorklet.addModule(workletUrl);
	const worklet = new AudioWorkletNode(context, 'recorder-worklet', { channelCount, numberOfOutputs: 0, numberOfInputs: 1 });
	return worklet;
};
