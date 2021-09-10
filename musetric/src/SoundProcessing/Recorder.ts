import { createPromiseAudioWorkletApi, createPromiseAudioWorklet } from '../Workers/PromiseAudioWorkletApi';
import { RecorderProcessOptions } from './RecorderWorklet';

export type Recorder = {
	mediaStream: MediaStream;
	start: () => Promise<void>;
	stop: () => Promise<void>;
};

const allTypes: (keyof Recorder)[] = ['start', 'stop'];

export const createRecorder = async (
	workletUrl: URL | string,
	channelCount: number,
	process: (options: RecorderProcessOptions) => void,
): Promise<Recorder> => {
	const audioContext = new AudioContext();
	const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount } });
	const source = audioContext.createMediaStreamSource(mediaStream);
	source.channelCount = channelCount;
	const worklet = await createPromiseAudioWorklet(source, workletUrl, 'recorder-worklet');
	const api = createPromiseAudioWorkletApi(worklet, process, allTypes);
	const { start, stop } = api;
	return { mediaStream, start, stop };
};
