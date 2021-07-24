import { useMemo } from 'react';
import {
	Theme, parseThemeUint32Color, PerformanceMonitorRef,
	Size2D, createFft, useAppCssContext,
	SoundBuffer, SoundCircularBuffer,
	usePixelCanvas, useAnimation,
} from '..';

export type FrequencyColors = {
	content: number;
	background: number;
};
export const createFrequencyColors = (theme: Theme) => {
	const { content, background } = parseThemeUint32Color(theme);
	return { content, background };
};

export const drawFrequency = (
	input: Float32Array,
	output: Uint8ClampedArray,
	frame: Size2D,
	colors: FrequencyColors,
): void => {
	const { content, background } = colors;
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
	isLive?: boolean;
	size: Size2D;
	pause?: boolean;
	performanceMonitor?: PerformanceMonitorRef | null;
};

export const useFrequency = (props: FrequencyProps) => {
	const {
		soundBuffer, soundCircularBuffer, isLive, size, pause, performanceMonitor,
	} = props;
	const { css } = useAppCssContext();
	const colors = useMemo(() => createFrequencyColors(css.theme), [css.theme]);

	const info = useMemo(() => {
		const windowSize = size.width * 2;
		const fft = createFft(windowSize);
		const result = new Float32Array(size.width);
		return { windowSize, fft, result };
	}, [size]);

	const draw = useMemo(() => {
		return (output: Uint8ClampedArray, frame: Size2D) => {
			const { windowSize, fft, result } = info;

			const getBuffer = () => {
				if (isLive) return { ...soundCircularBuffer, cursor: soundCircularBuffer.memorySize };
				return soundBuffer;
			};
			const { cursor, memorySize, buffers } = getBuffer();
			let offset = cursor < memorySize ? cursor - windowSize : memorySize - windowSize;
			offset = offset < 0 ? 0 : offset;
			const index = Math.floor(offset) * Float32Array.BYTES_PER_ELEMENT;
			const view = new Float32Array(buffers[0].buffer, index, windowSize);
			fft.frequency(view, result, { });
			drawFrequency(result, output, frame, colors);
		};
	}, [soundBuffer, soundCircularBuffer, isLive, info, colors]);

	const pixelCanvas = usePixelCanvas({ size });

	useAnimation(() => {
		if (pause) return;
		performanceMonitor?.begin();

		draw(pixelCanvas.image.data, pixelCanvas.size);
		pixelCanvas.context.putImageData(pixelCanvas.image, 0, 0);

		performanceMonitor?.end();
	}, [draw, pixelCanvas, pause, performanceMonitor]);

	return {
		image: pixelCanvas.canvas,
	};
};
