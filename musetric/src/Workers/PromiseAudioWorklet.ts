/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PromiseAudioWorkletRequest, PromiseAudioWorkletOptions, PostPromiseAudioWorklet, PromiseAudioWorkletHandlers } from './PromiseAudioWorkletTypes';

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
type ProcessorCtor = (new (options?: AudioWorkletNodeOptions) => AudioWorkletProcessorType);
declare function registerProcessor(name: string, processorCtor: ProcessorCtor): void;
declare const sampleRate: number;

export function runPromiseAudioWorklet(
	processorName: string,
	createHandlers: (options: PromiseAudioWorkletOptions) => PromiseAudioWorkletHandlers,
): void {
	const initHandlers = (messagePort: MessagePort) => {
		const post: PostPromiseAudioWorklet = (message) => {
			messagePort.postMessage(message);
		};

		const handlers = createHandlers({
			post,
			sampleRate,
		});
		messagePort.onmessage = (e: MessageEvent<PromiseAudioWorkletRequest>) => {
			const { id, type, args } = e.data;
			const result = handlers[type](...args);
			post({ id, type, result });
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
