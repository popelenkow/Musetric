import { useMemo, useCallback, useRef } from 'react';
import {
	Theme, parseThemeRgbColor,
	Size2D, Position2D, createFft,
	SoundBuffer, SoundCircularBuffer,
	mapAmplitudeToBel,
} from '..';

export const drawSpectrogram = (
	input: Float32Array[],
	output: Uint8ClampedArray,
	frame: Size2D,
	theme: Theme,
	cursor?: number,
): void => {
	const { content, background, active } = parseThemeRgbColor(theme);

	const step = (input.length - 1) / (frame.width - 1);
	for (let x = 0; x < frame.width; x++) {
		const offset = Math.round(x * step);
		const spectrum = input[offset];

		for (let y = 0; y < frame.height; y++) {
			const value = spectrum[y];
			const yIndex = 4 * y * frame.width;
			const index = 4 * x + yIndex;
			output[index] = (content.r * value + background.r * (1 - value));
			output[index + 1] = (content.g * value + background.g * (1 - value));
			output[index + 2] = (content.b * value + background.b * (1 - value));
			output[index + 3] = 255;
		}
	}

	if (typeof cursor === 'number') {
		const x = Math.round(cursor * (frame.width - 1));
		const color = active;
		for (let y = 0; y < frame.height; y++) {
			const yIndex = 4 * y * frame.width;
			const index = 4 * x + yIndex;
			output[index + 0] = color.r;
			output[index + 1] = color.g;
			output[index + 2] = color.b;
			output[index + 3] = 255;
		}
	}
};

export type SpectrogramProps = {
	soundBuffer: SoundBuffer;
	soundCircularBuffer: SoundCircularBuffer;
	size: Size2D;
	isLive?: boolean;
};

export const useSpectrogram = (props: SpectrogramProps) => {
	const {
		soundBuffer, soundCircularBuffer, size, isLive,
	} = props;

	const result = useRef<Float32Array[]>([]);

	const info = useMemo(() => {
		const windowSize = size.height * 2;
		const fft = createFft(windowSize);
		return { windowSize, fft };
	}, [size]);

	const draw = useMemo(() => {
		return (output: Uint8ClampedArray, frame: Size2D, theme: Theme) => {
			const { windowSize, fft } = info;

			const buffer = isLive ? soundCircularBuffer.buffers[0] : soundBuffer.buffers[0];
			const step = windowSize;
			const cursor = isLive ? undefined : soundBuffer.cursor / (soundBuffer.memorySize - 1);

			let frequencies: Float32Array[] = result.current;
			const count = 1 + Math.floor((buffer.length - windowSize) / step);
			if (frequencies.length !== count) {
				frequencies = [];
				for (let i = 0; i < count; i++) {
					const array = new Float32Array(windowSize / 2);
					frequencies.push(array);
				}
				result.current = frequencies;
			}
			fft.frequencies(buffer, frequencies, { offset: 0, step, count });
			mapAmplitudeToBel(frequencies);
			drawSpectrogram(frequencies, output, frame, theme, cursor);
		};
	}, [soundBuffer, soundCircularBuffer, isLive, info, result]);

	const onClick = useCallback((cursorPosition: Position2D) => {
		if (isLive) return;
		const value = Math.round(cursorPosition.x * (soundBuffer.memorySize - 1));
		soundBuffer.setCursor(value);
	}, [soundBuffer, isLive]);

	return {
		draw, onClick,
	};
};
