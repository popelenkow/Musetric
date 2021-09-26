/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { v4 as uuid } from 'uuid';
import { PromiseAudioWorkletRequest, PromiseAudioWorkletResponse, PromiseAudioWorkletApi } from './PromiseAudioWorkletTypes';

export const createPromiseAudioWorklet = async (
	audioNode: AudioNode,
	workletUrl: URL | string,
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
): PromiseAudioWorkletApi => {
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

	const api: PromiseAudioWorkletApi = {};
	allTypes.forEach((type) => {
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
