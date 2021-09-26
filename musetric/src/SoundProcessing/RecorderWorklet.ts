import { runPromiseAudioWorklet } from '../Workers/PromiseAudioWorklet';
import { PromiseAudioWorkletOptions } from '../Workers/PromiseAudioWorkletTypes';

export type RecorderProcessOptions = {
	chunk: Float32Array[];
	isRecording: boolean;
};

export type RecorderHandlers = {
	process: (input: Float32Array[]) => void;
	start: () => void;
	stop: () => void;
};
export const createRecorderHandlers = (options: PromiseAudioWorkletOptions): RecorderHandlers => {
	const { post, sampleRate } = options;

	let isRecording = false;
	const length = Math.floor(sampleRate / 30);
	let offset = 0;
	const buffer = [
		new Float32Array(length),
		new Float32Array(length),
	];

	const process = (input: Float32Array[]) => {
		const step = input[0].length;
		const push = () => {
			if (length < offset + step) throw new Error(`Recorder: { length: ${length}, offset: ${offset}, step: ${step} }`);
			for (let i = 0; i < input.length; i++) {
				const x = input[i];
				buffer[i].set(x, offset);
			}
			offset += step;
		};
		push();
		if (length < offset + step) {
			const chunk = buffer.map((x) => x.slice(0, offset));
			const id = '';
			const type = 'process';
			const result: RecorderProcessOptions = {
				chunk,
				isRecording,
			};
			post({ id, type, result });
			offset = 0;
		}
	};
	const start = () => {
		isRecording = true;
	};
	const stop = () => {
		isRecording = false;
	};
	const handlers = {
		process,
		start,
		stop,
	};
	return handlers;
};

export const runRecorderWorklet = (): void => {
	runPromiseAudioWorklet('recorder-worklet', createRecorderHandlers);
};
