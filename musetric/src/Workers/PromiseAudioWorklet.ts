import type { UndefinedObject } from '../Typescript/UndefinedObject';
import type { PromiseWorkerRequest, PromiseWorkerOptions, PromiseWorkerEvents, PromiseWorkerResponse, PromiseWorker } from './PromiseWorker';

/*
https://github.com/microsoft/TypeScript/issues/28308
https://stackoverflow.com/questions/61089091/is-it-possible-to-get-raw-values-of-audio-data-using-mediarecorder
https://www.html5rocks.com/en/tutorials/getusermedia/intro/#toc-webaudio-api
*/
type AudioWorkletProcessorType = {
	readonly port: MessagePort;
	process(
		inputs: Float32Array[][],
		outputs: Float32Array[][],
		parameters: Record<string, Float32Array>,
	): boolean;
};
declare const AudioWorkletProcessor: {
	prototype: AudioWorkletProcessorType;
	new(options?: AudioWorkletNodeOptions): AudioWorkletProcessorType;
};
type ProcessorCtor = (new (options?: AudioWorkletNodeOptions) => AudioWorkletProcessorType);
declare const registerProcessor: (name: string, processorCtor: ProcessorCtor) => void;
declare const sampleRate: number;
declare const currentTime: number;

export type PromiseAudioWorkletState = {
	sampleRate: number;
	currentTime: number;
};
export type PromiseAudioWorkletOptions<Events extends PromiseWorkerEvents> =
	& PromiseWorkerOptions<Events>
	& {
		getWorkletState: () => PromiseAudioWorkletState;
	};
export type PromiseAudioWorkletOnProcess = {
	process: (
		input: Float32Array[],
		outputs: Float32Array[],
		parameters: Record<string, Float32Array>,
	) => void;
};
export type PromiseAudioWorklet = PromiseWorker & PromiseAudioWorkletOnProcess;

export const runPromiseAudioWorklet = <Events extends PromiseWorkerEvents>(
	processorName: string,
	createWorklet: (options: PromiseAudioWorkletOptions<Events>) => PromiseAudioWorklet,
	templateEvents: UndefinedObject<PromiseWorkerEvents>,
): void => {
	const initWorklet = (messagePort: MessagePort) => {
		const post = (message: PromiseWorkerResponse) => {
			messagePort.postMessage(message);
		};
		const getWorkletState = () => ({ sampleRate, currentTime });

		const events: PromiseWorkerEvents = {};
		Object.keys(templateEvents).forEach((type) => {
			events[type] = (result: unknown) => {
				const id = '';
				post({ id, type, result });
			};
		});

		const worklet = createWorklet({
			events: events as Events,
			getWorkletState,
		});
		messagePort.onmessage = (e: MessageEvent<PromiseWorkerRequest>) => {
			const { id, type, args } = e.data;
			const result = worklet[type](...args);
			post({ id, type, result });
		};
		return worklet;
	};

	class PromiseAudioWorkletProcessor extends AudioWorkletProcessor {
		worklet = initWorklet(this.port);

		process(
			[input]: Float32Array[][],
			[output]: Float32Array[][],
			parameters: Record<string, Float32Array>,
		): boolean {
			this.worklet.process(input, output, parameters);
			return true;
		}
	}

	registerProcessor(processorName, PromiseAudioWorkletProcessor);
};
