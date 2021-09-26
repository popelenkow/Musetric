// Very messy code. Try to implement worklet?
import { SoundBuffer } from '../Sounds/SoundBuffer';
import { AnimationState, createAnimation } from '../Rendering/Animation';

export type CreatePlayerOptions = {
	sampleRate: number;
	channelCount: number;
	onStopped: () => void;
};
export type Player = {
	start: (soundBuffer: SoundBuffer) => void;
	stop: () => void;
};
export const createPlayer = (options: CreatePlayerOptions): Player => {
	const { sampleRate, channelCount, onStopped } = options;
	const audioContext = new AudioContext({ sampleRate });
	const length = Math.floor(sampleRate / 5);
	const myArrayBuffer = audioContext.createBuffer(channelCount, length, sampleRate);
	const buffers: Float32Array[] = [];
	for (let i = 0; i < channelCount; i++) {
		buffers.push(new Float32Array(length));
	}

	const { start, stop } = createAnimation((soundBuffer: SoundBuffer): AnimationState => {
		const source = audioContext.createBufferSource();
		source.buffer = myArrayBuffer;
		source.loop = true;
		source.connect(audioContext.destination);
		source.start();
		let pin = {
			context: audioContext.currentTime,
			buffer: soundBuffer.cursor,
		};
		const startedAt = pin.context;
		let prevCursor = soundBuffer.cursor;

		const copy = (offset: number, to: number) => {
			for (let channel = 0; channel < channelCount; channel++) {
				const nowBuffering = buffers[channel];
				const fromBuffer = soundBuffer.buffers[channel];
				for (let i = 0; i < length - offset && i < to; i++) {
					nowBuffering[i + offset] = fromBuffer[i + prevCursor];
				}
				for (let i = to; i < length - offset; i++) {
					nowBuffering[i + offset] = 0;
				}
				for (let i = 0; i < offset && i < to - offset; i++) {
					nowBuffering[i] = fromBuffer[i + prevCursor + offset];
				}
				for (let i = 0; i < offset; i++) {
					nowBuffering[i] = 0;
				}
			}
			for (let channel = 0; channel < channelCount; channel++) {
				const fromBuffer = buffers[channel];
				myArrayBuffer.copyToChannel(fromBuffer, channel);
			}
		};
		const onIteration = () => {
			const getCursor = () => {
				if (prevCursor !== soundBuffer.cursor) {
					pin = {
						context: audioContext.currentTime,
						buffer: soundBuffer.cursor,
					};
					return pin.buffer;
				}
				const current = audioContext.currentTime - pin.context;
				return Math.floor(current * sampleRate) + pin.buffer;
			};
			const getOffset = () => {
				const time = Math.round((audioContext.currentTime - startedAt) * sampleRate);
				const times = Math.floor(time / length);
				return time - times * length;
			};
			const offset = getOffset();
			const cursor = getCursor();
			prevCursor = cursor;
			if (cursor >= soundBuffer.length) {
				stop();
				soundBuffer.setCursor(0);
				return;
			}
			soundBuffer.setCursor(cursor);
			const to = soundBuffer.length - cursor;
			copy(offset, to);
		};
		const onStop = () => {
			source.stop();
			copy(0, 0);
		};
		return {
			onIteration,
			onStop,
			onStopped,
		};
	});

	return { start, stop };
};
