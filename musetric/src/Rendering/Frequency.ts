import { useMemo } from 'react';
import {
	ColorTheme, parseThemeUint32Color,
	Size2D, createFft,
	SoundBuffer, SoundCircularBuffer,
	mapAmplitudeToBel,
} from '..';

export const drawFrequency = (
	input: Float32Array,
	output: Uint8ClampedArray,
	frame: Size2D,
	colorTheme: ColorTheme,
): void => {
	const { content, background } = parseThemeUint32Color(colorTheme);
	const out = new Uint32Array(output.buffer);

	const step = (1.0 * input.length) / frame.height;

	for (let y = 0; y < frame.height; y++) {
		const offset = Math.floor(y * step);
		const magnitude = input[offset];
		const index = y * frame.width;
		const limit = Math.ceil(magnitude * frame.width);

		out.fill(content, index, index + limit);
		out.fill(background, index + limit, index + frame.width);
	}
};

export type FrequencyProps = {
	soundBuffer: SoundBuffer;
	soundCircularBuffer: SoundCircularBuffer;
	size: Size2D;
	isLive?: boolean;
};

export const useFrequency = (props: FrequencyProps) => {
	const {
		soundBuffer, soundCircularBuffer, size, isLive,
	} = props;

	const info = useMemo(() => {
		const windowSize = size.width * 2;
		const fft = createFft(windowSize);
		const result = new Float32Array(size.width);
		return { windowSize, fft, result };
	}, [size]);

	const draw = useMemo(() => {
		return (output: Uint8ClampedArray, frame: Size2D, colorTheme: ColorTheme) => {
			const { windowSize, fft, result } = info;

			const getBuffer = () => {
				if (isLive) return { ...soundCircularBuffer, cursor: soundCircularBuffer.memorySize };
				return soundBuffer;
			};
			const { cursor, memorySize, buffers } = getBuffer();
			let offset = cursor < memorySize ? cursor - windowSize : memorySize - windowSize;
			offset = offset < 0 ? 0 : offset;
			fft.frequency(buffers[0], result, { offset });
			mapAmplitudeToBel([result]);
			drawFrequency(result, output, frame, colorTheme);
		};
	}, [soundBuffer, soundCircularBuffer, isLive, info]);

	return {
		draw,
	};
};
