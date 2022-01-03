import type { PromiseObjectApi } from '../Typescript/PromiseObjectApi';
import type { EventHandlers } from '../Typescript/Events';
import { createPromiseWorkerApi } from '../Workers/PromiseWorkerApi';
import type { RecorderWorklet, RecorderEvents } from './RecorderWorklet';

export type Recorder =
	& PromiseObjectApi<RecorderWorklet>
	& {
		mediaStream: MediaStream;
	};

export const createRecorder = async (
	workletUrl: URL | string,
	channelCount: number,
	handlers: EventHandlers<RecorderEvents>,
): Promise<Recorder> => {
	const audioContext = new AudioContext();
	const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount } });
	const source = audioContext.createMediaStreamSource(mediaStream);
	source.channelCount = channelCount;
	const options: AudioWorkletNodeOptions = {
		channelCount,
		numberOfOutputs: 0,
		numberOfInputs: 1,
	};
	await source.context.audioWorklet.addModule(workletUrl);
	const worklet = new AudioWorkletNode(source.context, 'RecorderWorklet', options);
	source.connect(worklet);
	const request = createPromiseWorkerApi<RecorderWorklet, RecorderEvents>(worklet.port, handlers);
	return {
		start: (...args) => request('start', args),
		stop: (...args) => request('stop', args),
		mediaStream,
	};
};
