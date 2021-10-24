import { runPromiseAudioWorklet, PromiseAudioWorkletOnProcess } from '../Workers/PromiseAudioWorklet';
import type { PromiseAudioWorkletOptions } from '../Workers/PromiseAudioWorklet';
import type { UndefinedObject } from '../Typescript/UndefinedObject';

export type RecorderProcessOptions = {
	chunk: Float32Array[];
	isRecording: boolean;
};

export type RecorderWorklet = {
	start: () => void;
	stop: () => void;
};

export type RecorderWorkletEvents = {
	onProcess: (options: RecorderProcessOptions) => void;
};
const templateEvents: UndefinedObject<RecorderWorkletEvents> = {
	onProcess: undefined,
};
type RecorderWorkletOptions = PromiseAudioWorkletOptions<RecorderWorkletEvents>;

export const createRecorderWorklet = (
	options: RecorderWorkletOptions,
): RecorderWorklet & PromiseAudioWorkletOnProcess => {
	const { events, getWorkletState } = options;
	const { onProcess } = events;
	const { sampleRate } = getWorkletState();

	let isRecording = false;
	const length = Math.floor(sampleRate / 60);
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
			const result: RecorderProcessOptions = {
				chunk,
				isRecording,
			};
			onProcess(result);
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
	runPromiseAudioWorklet('RecorderWorklet', createRecorderWorklet, templateEvents);
};
