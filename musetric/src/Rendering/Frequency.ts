import { useMemo } from 'react';
import {
	Theme, parseThemeUint32Color, PerformanceMonitorRef,
	Size2D, createFft, useAppCssContext,
	SoundBuffer, SoundCircularBuffer,
	mapAmplitudeToBel, usePixelCanvas, useAnimation,
} from '..';

export const drawFrequency = (
	input: Float32Array,
	output: Uint8ClampedArray,
	frame: Size2D,
	theme: Theme,
): void => {
	const { content, background } = parseThemeUint32Color(theme);
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

	const info = useMemo(() => {
		const windowSize = size.width * 2;
		const fft = createFft(windowSize);
		const result = new Float32Array(size.width);
		return { windowSize, fft, result };
	}, [size]);

	const draw = useMemo(() => {
		return (output: Uint8ClampedArray, frame: Size2D, theme: Theme) => {
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
			drawFrequency(result, output, frame, theme);
		};
	}, [soundBuffer, soundCircularBuffer, isLive, info]);

	const pixelCanvas = usePixelCanvas({ size });

	useAnimation(() => {
		if (pause) return;
		performanceMonitor?.begin();

		draw(pixelCanvas.image.data, pixelCanvas.size, css.theme);
		pixelCanvas.context.putImageData(pixelCanvas.image, 0, 0);

		performanceMonitor?.end();
	}, [draw, pixelCanvas, pause, css, performanceMonitor]);

	return {
		image: pixelCanvas.canvas,
	};
};
