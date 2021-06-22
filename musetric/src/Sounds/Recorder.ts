import { createPromiseAudioWorkletApi } from '..';

export type Recorder = {
	mediaStream: MediaStream;
	start: () => Promise<void>;
	stop: () => Promise<void>;
};
export type RecorderProcessOptions = {
	chunk: Float32Array[];
	isRecording: boolean;
};
export type RecorderHandlers = {
	process: (inputRaw: Float32Array[]) => [boolean, RecorderProcessOptions];
	start: () => void;
	stop: () => void;
};
type RecorderType = keyof RecorderHandlers;
const allRecorderTypes: RecorderType[] = ['start', 'stop'];

export function createRecorderHandlers(): RecorderHandlers {
	type State = {
		isRecording: boolean;
	};
	const state: State = {
		isRecording: false,
	};

	const process: RecorderHandlers['process'] = (inputRaw) => {
		const { isRecording } = state;
		const chunk = inputRaw.map(x => {
			const result = new Float32Array(x.length);
			result.set(x);
			return result;
		});
		const options: RecorderProcessOptions = {
			chunk,
			isRecording,
		};
		return [true, options];
	};
	const start: RecorderHandlers['start'] = () => {
		state.isRecording = true;
	};
	const stop: RecorderHandlers['stop'] = () => {
		state.isRecording = false;
	};
	const handlers: RecorderHandlers = {
		process,
		start,
		stop,
	};
	return handlers;
}

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
	const api = await createPromiseAudioWorkletApi(source, 'recorder-worklet', process, createRecorderHandlers, allRecorderTypes);
	const { start, stop } = api;
	return { mediaStream, start, stop };
};
