import { runPromiseAudioWorklet, PromiseAudioWorkletOnProcess } from '../Workers/PromiseAudioWorklet';
import type { PromiseAudioWorkletOptions } from '../Workers/PromiseAudioWorklet';

export type RecorderWorklet = {
	start: () => void,
	stop: () => void,
};

export type RecorderEvents = {
	onProcess: {
		chunk: Float32Array[],
		isRecording: boolean,
	},
};

export const createRecorderWorklet = (
	options: PromiseAudioWorkletOptions<RecorderEvents>,
): RecorderWorklet & PromiseAudioWorkletOnProcess => {
	const { pushEvent, getWorkletState } = options;
	const { sampleRate } = getWorkletState();

	let isRecording = false;
	const length = Math.floor(sampleRate / 60);
	let offset = 0;
	const buffer = [
		new Float32Array(length),
		new Float32Array(length),
	];

	const process = (input: Float32Array[]): void => {
		const step = input[0].length;
		const push = (): void => {
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
			const result: RecorderEvents['onProcess'] = {
				chunk,
				isRecording,
			};
			pushEvent('onProcess', result);
			offset = 0;
		}
	};
	const start = (): void => {
		isRecording = true;
	};
	const stop = (): void => {
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
	runPromiseAudioWorklet<RecorderEvents>('RecorderWorklet', createRecorderWorklet);
};
