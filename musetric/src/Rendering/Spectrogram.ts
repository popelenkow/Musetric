import { useMemo, useCallback, MouseEvent, useRef } from 'react';
import {
	ColorTheme, parseColorThemeRgb,
	Layout2D, Size2D, getCanvasCursorPosition, createFft,
	SoundBuffer, SoundCircularBuffer,
	CanvasViewProps,
} from '..';

export const drawSpectrogram = (
	input: Float32Array[],
	output: Uint8ClampedArray,
	layout: Layout2D,
	colorTheme: ColorTheme,
	cursor?: number,
): void => {
	const { frame, view, position } = layout;

	const { content, background, active } = parseColorThemeRgb(colorTheme);

	const column = new Float32Array(view.height);
	const step = (input.length - 1) / (view.width - 1);
	for (let x = 0; x < view.width; x++) {
		const offset = Math.round(x * step);
		const spectrum = input[offset];
		for (let y = 0; y < view.height; y++) {
			const value = Math.log10(spectrum[y]) / 5;
			column[y] = Math.max(0, Math.min(1, value + 1));
		}

		for (let y = 0; y < view.height; y++) {
			const value = column[y];
			const yIndex = 4 * (position.y + frame.height - y) * frame.width;
			const index = 4 * (position.x + x) + yIndex;
			output[index] = (content.r * value + background.r * (1 - value));
			output[index + 1] = (content.g * value + background.g * (1 - value));
			output[index + 2] = (content.b * value + background.b * (1 - value));
			output[index + 3] = 255;
		}
	}

	if (typeof cursor === 'number') {
		const x = Math.round(cursor * (view.width - 1));
		const color = active;
		for (let y = 0; y < view.height; y++) {
			const yIndex = 4 * (position.y + y) * frame.width;
			const index = 4 * (position.x + x) + yIndex;
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

export const useSpectrogram = (props: SpectrogramProps): CanvasViewProps => {
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
		return (output: Uint8ClampedArray, layout: Layout2D, colorTheme: ColorTheme) => {
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

			fft.frequencies(buffer, frequencies, step);
			drawSpectrogram(frequencies, output, layout, colorTheme, cursor);
		};
	}, [soundBuffer, soundCircularBuffer, isLive, info, result]);

	const onClick = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
		if (isLive) return;
		const pos = getCanvasCursorPosition(e.currentTarget, e.nativeEvent);
		const value = Math.round(pos.x * (soundBuffer.memorySize - 1));
		soundBuffer.setCursor(value);
	}, [soundBuffer, isLive]);

	const canvasViewProps: CanvasViewProps = {
		draw, size, onClick,
	};

	return canvasViewProps;
};
