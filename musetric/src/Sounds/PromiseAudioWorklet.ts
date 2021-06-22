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

/** [id, type, args] */
export type PromiseAudioWorkletRequest = [string, string, ...any[]];
/** [id, type, args] */
export type PromiseAudioWorkletResponse = [string, string, any];
// eslint-disable-next-line max-len
export type PromiseAudioWorkletHandlers = { process: (inputRaw: Float32Array[]) => [boolean, any]; } & Record<string, (...args: any[]) => any>;
export type PromiseAudioWorkletApi = Record<string, (...args: any[]) => Promise<any>>;

export function promiseAudioWorkletFunction(
	processorName: string, createHandlers: (messagePort: MessagePort) => PromiseAudioWorkletHandlers,
): void {
	const initHandlers = (messagePort: MessagePort) => {
		const handlers = createHandlers(messagePort);
		messagePort.onmessage = (e: MessageEvent<PromiseAudioWorkletRequest>) => {
			const postMessage = (message: PromiseAudioWorkletResponse) => {
				messagePort.postMessage(message);
			};
			const [id, type, ...args] = e.data;
			const result = handlers[type](...args);
			postMessage([id, type, result]);
		};
		return handlers;
	};

	class RecorderProcessor extends AudioWorkletProcessor {
		public static parameterDescriptors = [];

		handlers = initHandlers(this.port);

		process([inputRaw]: Float32Array[][]): boolean {
			const [need, ...result] = this.handlers.process(inputRaw);
			need && this.port.postMessage(['', 'process', ...result]);
			return true;
		}
	}

	registerProcessor(processorName, RecorderProcessor);
}

export const createPromiseAudioWorklet = async (
	audioNode: AudioNode,
	processorName: string,
	createHandlers: (messagePort: MessagePort) => PromiseAudioWorkletHandlers,
): Promise<AudioWorkletNode> => {
	const createHandlersCode = `const createHandlers = ${createHandlers.toString()};`;
	const createWorkletCode = `const createWorklet = ${promiseAudioWorkletFunction.toString()};`;
	const runWorkerCode = `createWorklet('${processorName}', createHandlers);`;
	const code = `${createHandlersCode}\n${createWorkletCode}\n${runWorkerCode}`;
	const workletUrl = URL.createObjectURL(new Blob([code], { type: 'application/javascript' }));
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

export const createPromiseAudioWorkletApi = async (
	audioNode: AudioNode,
	processorName: string,
	process: (options: any) => void,
	createHandlers: (messagePort: MessagePort) => PromiseAudioWorkletHandlers,
	allTypes: string[],
) => {
	// eslint-disable-next-line max-len
	const worklet = await createPromiseAudioWorklet(audioNode, processorName, createHandlers);
	const massagePort = worklet.port;
	const postMessage = (message: PromiseAudioWorkletRequest): void => {
		massagePort.postMessage(message);
	};
	const callbacks: Record<string, (result: any) => void> = {};

	massagePort.onmessage = (e: MessageEvent<PromiseAudioWorkletResponse>) => {
		const [id, type, result] = e.data;
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
				postMessage([id, type, ...args]);
			});
		};
	});

	return api;
};
