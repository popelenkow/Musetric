import { useMemo } from 'react';
import {
	ColorTheme, parseThemeRgbColor,
	Size2D, createFft,
	SoundBuffer, SoundCircularBuffer,
} from '..';

export const drawFrequency = (
	input: Float32Array,
	output: Uint8ClampedArray,
	frame: Size2D,
	colorTheme: ColorTheme,
): void => {
	const { content, background } = parseThemeRgbColor(colorTheme);

	const step = (1.0 * input.length) / frame.width;

	for (let x = 0; x < frame.width; x++) {
		const offset = Math.floor(x * step);
		const value = Math.log10(input[offset]) / 5;
		const magnitude = Math.max(0, Math.min(1, value + 1));

		for (let y = 0; y < frame.height; y++) {
			const yIndex = 4 * y * frame.width;
			const index = 4 * x + yIndex;
			const isDraw = frame.height - y - 1 < magnitude * frame.height;
			const color = isDraw ? content : background;
			output[index + 0] = color.r;
			output[index + 1] = color.g;
			output[index + 2] = color.b;
			output[index + 3] = 255;
		}
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
			fft.frequency(buffers[0], result, offset);
			drawFrequency(result, output, frame, colorTheme);
		};
	}, [soundBuffer, soundCircularBuffer, isLive, info]);

	return {
		draw,
	};
};
