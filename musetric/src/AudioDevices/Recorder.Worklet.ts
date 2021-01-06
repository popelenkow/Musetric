import * as Types from './Recorder.Types';

/*
https://stackoverflow.com/questions/61089091/is-it-possible-to-get-raw-values-of-audio-data-using-mediarecorder
https://www.html5rocks.com/en/tutorials/getusermedia/intro/#toc-webaudio-api
https://github.com/microsoft/TypeScript/issues/28308
https://bitbucket.org/alvaro_maceda/notoono/src/master/src/audio-meter.js
https://gist.github.com/flpvsk/047140b31c968001dc563998f7440cc1
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
	numChannels: number;
	sampleRate: number;
	recLength: number;
	recBuffers: Float32Array[][];
	isRecording: boolean;
};
export function workletFunction(): void {
	class NewRecorderProcessor extends AudioWorkletProcessor {
		public static parameterDescriptors = [];

		api: Api;

		state: State;

		constructor(options?: AudioWorkletNodeOptions) {
			super(options);
			const [api, state] = this.createApi();

			this.api = api;
			this.state = state;

			this.port.onmessage = (e: MessageEvent<Types.InMessage>) => {
				api[e.data.type](e.data.id, e.data.options);
			};
		}

		process([input]: Float32Array[][]): boolean {
			if (this.state.isRecording) {
				for (let channel = 0; channel < this.state.numChannels; channel++) {
					this.state.recBuffers[channel].push(input[channel].map(x => x));
				}
				this.state.recLength += input[0].length;
			}
			return true;
		}

		createApi = (): [Api, State] => {
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
				const state: State = {
					numChannels: 0,
					sampleRate: 0,
					recLength: 0,
					recBuffers: [],
					isRecording: false,
				};

				const init: Types.MessageHandler<Types.InitOptions> = (_id, options) => {
					state.sampleRate = options.sampleRate;
					state.numChannels = options.numChannels;
					state.recLength = 0;
					state.recBuffers = createArray(state.numChannels);
					// state.recBuffers[0].push(new Float32Array([1, 2]));
				};

				const start: Types.MessageHandler<void> = () => {
					state.isRecording = true;
				};

				const stop: Types.MessageHandler<void> = () => {
					state.isRecording = false;
				};

				const clear: Types.MessageHandler<void> = () => {
					state.recLength = 0;
					state.recBuffers = createArray(state.numChannels);
				};

				const getBuffer: Types.MessageHandler<void> = (id) => {
					const buffers = [];
					for (let channel = 0; channel < state.numChannels; channel++) {
						buffers.push(mergeBuffers(state.recBuffers[channel], state.recLength));
					}
					this.port.postMessage({ id, type: 'getBuffer', result: buffers });
				};

				const api: Api = {
					init,
					clear,
					start,
					stop,
					getBuffer,
				};
				return [api, state];
			}
		};
	}

	registerProcessor('recorder-worklet', NewRecorderProcessor);
}

export type WorkletOptions = {
	channelCount: number;
	bufferSize?: number;
};

// eslint-disable-next-line max-len
export const createWorklet = async (context: BaseAudioContext, options: WorkletOptions): Promise<AudioWorkletNode> => {
	const { channelCount, bufferSize } = options;
	const workletUrl = URL.createObjectURL(new Blob(['(', workletFunction.toString(), ')()'], { type: 'application/javascript' }));
	await context.audioWorklet.addModule(workletUrl);
	const worklet = new AudioWorkletNode(context, 'recorder-worklet', { channelCount, numberOfOutputs: 0, numberOfInputs: 1, processorOptions: { bufferSize } });
	return worklet;
};
