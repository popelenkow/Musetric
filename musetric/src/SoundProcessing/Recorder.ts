import type { UndefinedObject } from '../Typescript/UndefinedObject';
import type { PromiseObjectApi } from '../Typescript/PromiseObjectApi';
import { createPromiseAudioWorkletApi } from '../Workers/PromiseAudioWorkletApi';
import type { RecorderWorklet, RecorderWorkletEvents } from './RecorderWorklet';

export type Recorder =
	& PromiseObjectApi<RecorderWorklet>
	& RecorderWorkletEvents
	& {
		mediaStream: MediaStream;
	};
const recorderTemplate: UndefinedObject<RecorderWorklet> = {
	start: undefined,
	stop: undefined,
};

export const createRecorder = async (
	workletUrl: URL | string,
	channelCount: number,
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
	const api = createPromiseAudioWorkletApi<RecorderWorklet>(worklet, recorderTemplate);
	const result = api as Recorder;
	result.mediaStream = mediaStream;
	return result;
};
