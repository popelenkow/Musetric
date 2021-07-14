import { createPromiseAudioWorkletApi, createPromiseAudioWorklet } from '../Workers/PromiseAudioWorkletApi';
import { RecorderProcessOptions } from './RecorderWorklet';

export type Recorder = {
	mediaStream: MediaStream;
	start: () => Promise<void>;
	stop: () => Promise<void>;
};

const allRecorderTypes: (keyof Recorder)[] = ['start', 'stop'];

export type CreateRecorderOptions = {
	channelCount: number;
	process: (options: RecorderProcessOptions) => void;
};
export const createRecorder = async (options: CreateRecorderOptions): Promise<Recorder> => {
	const { channelCount, process } = options;
	const audioContext = new AudioContext();
	const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount } });
	const source = audioContext.createMediaStreamSource(mediaStream);
	source.channelCount = channelCount;
	const worklet = await createPromiseAudioWorklet(source, 'musetricRecorder.js', 'recorder-worklet');
	const api = createPromiseAudioWorkletApi(worklet, process, allRecorderTypes);
	const { start, stop } = api;
	return { mediaStream, start, stop };
};
