/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { v4 as uuid } from 'uuid';

/*
https://github.com/microsoft/TypeScript/issues/28308
https://stackoverflow.com/questions/61089091/is-it-possible-to-get-raw-values-of-audio-data-using-mediarecorder
https://www.html5rocks.com/en/tutorials/getusermedia/intro/#toc-webaudio-api
*/
type AudioWorkletProcessorType = {
	readonly port: MessagePort;
	// eslint-disable-next-line max-len
	process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
};
declare const AudioWorkletProcessor: {
	prototype: AudioWorkletProcessorType;
	new(options?: AudioWorkletNodeOptions): AudioWorkletProcessorType;
};
type ProcessorCtor = (new (options?: AudioWorkletNodeOptions) => AudioWorkletProcessorType)
& { parameterDescriptors?: AudioParamDescriptor[] };
declare function registerProcessor(name: string, processorCtor: ProcessorCtor): void;

export type PromiseAudioWorkletRequest = {
	id: string;
	type: string;
	args: any[];
};
export type PromiseAudioWorkletResponse = {
	id: string;
	type: string;
	result: any;
};
// eslint-disable-next-line max-len
export type PromiseAudioWorkletHandlers = { process: (inputRaw: Float32Array[]) => void; } & Record<string, (...args: any[]) => any>;
export type PromiseAudioWorkletApi = Record<string, (...args: any[]) => Promise<any>>;
export type PostPromiseAudioWorklet = (message: PromiseAudioWorkletResponse) => void;

export function runPromiseAudioWorklet(
	processorName: string,
	createHandlers: (post: PostPromiseAudioWorklet) => PromiseAudioWorkletHandlers,
): void {
	const initHandlers = (messagePort: MessagePort) => {
		const postMessage: PostPromiseAudioWorklet = (message) => {
			messagePort.postMessage(message);
		};

		const handlers = createHandlers(postMessage);
		messagePort.onmessage = (e: MessageEvent<PromiseAudioWorkletRequest>) => {
			const { id, type, args } = e.data;
			const result = handlers[type](...args);
			postMessage({ id, type, result });
		};
		return handlers;
	};

	class RecorderProcessor extends AudioWorkletProcessor {
		handlers = initHandlers(this.port);

		process([inputRaw]: Float32Array[][]): boolean {
			this.handlers.process(inputRaw);
			return true;
		}
	}

	registerProcessor(processorName, RecorderProcessor);
}

export const createPromiseAudioWorklet = async (
	audioNode: AudioNode,
	workletUrl: string,
	processorName: string,
): Promise<AudioWorkletNode> => {
	await audioNode.context.audioWorklet.addModule(workletUrl);
	const options: AudioWorkletNodeOptions = {
		channelCount: audioNode.channelCount,
		numberOfOutputs: 0,
		numberOfInputs: 1,
	};
	const worklet = new AudioWorkletNode(audioNode.context, processorName, options);
	audioNode.connect(worklet);
	return worklet;
};

export const createPromiseAudioWorkletApi = (
	worklet: AudioWorkletNode,
	process: (options: any) => void,
	allTypes: string[],
) => {
	const massagePort = worklet.port;
	const postMessage = (message: PromiseAudioWorkletRequest): void => {
		massagePort.postMessage(message);
	};
	const callbacks: Record<string, (result: any) => void> = {};

	massagePort.onmessage = (e: MessageEvent<PromiseAudioWorkletResponse>) => {
		const { id, type, result } = e.data;
		if (type === 'process') {
			process(result);
			return;
		}
		const callback = callbacks[id];
		delete callbacks[id];
		callback(result);
	};

	const api: Record<string, (...args: any[]) => Promise<any>> = {};
	allTypes.forEach(type => {
		api[type] = (...args) => {
			return new Promise((resolve) => {
				const id = uuid();
				const callback = (result: any) => { resolve(result); };
				callbacks[id] = callback;
				postMessage({ id, type, args });
			});
		};
	});

	return api;
};
