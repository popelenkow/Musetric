import { runPromiseAudioWorklet, PostPromiseAudioWorklet } from './PromiseAudioWorklet';

export type RecorderProcessOptions = {
	chunk: Float32Array[];
	isRecording: boolean;
};

export const createRecorderHandlers = (post: PostPromiseAudioWorklet) => {
	type State = {
		isRecording: boolean;
	};
	const state: State = {
		isRecording: false,
	};

	const process = (inputRaw: Float32Array[]) => {
		const { isRecording } = state;
		const chunk = inputRaw.map(x => {
			const result = new Float32Array(x.length);
			result.set(x);
			return result;
		});
		const id = '';
		const type = 'process';
		const result : RecorderProcessOptions = {
			chunk,
			isRecording,
		};
		post({ id, type, result });
	};
	const start = () => {
		state.isRecording = true;
	};
	const stop = () => {
		state.isRecording = false;
	};
	const handlers = {
		process,
		start,
		stop,
	};
	return handlers;
};

export const runRecorderWorklet = () => {
	runPromiseAudioWorklet('recorder-worklet', createRecorderHandlers);
};
