/* eslint-disable max-len */
import React, { useMemo, useState, useCallback } from 'react';
import {
	Theme, createUseClasses, useTheme, parseColorThemeRgb,
	Layout2D, Size2D, getCanvasCursorPosition, useAnimation,
	createFft, PerformanceMonitorRef, SoundBuffer, SoundFixedQueue,
} from '..';

export const getSpectrogramClasses = (theme: Theme) => ({
	root: {
		display: 'block',
		background: theme.color.app,
		width: '100%',
		height: '100%',
	},
});

export const useSpectrogramClasses = createUseClasses('Spectrogram', getSpectrogramClasses);

export const drawSpectrogram = (
	input: Float32Array[],
	output: Uint8ClampedArray,
	layout: Layout2D,
	cursor?: number,
): void => {
	const { frame, view, position, colorTheme } = layout;

	const { content, background, active } = parseColorThemeRgb(colorTheme);

	const column = new Float32Array(view.height);
	const step = input.length / view.width;
	for (let x = 0; x < view.width; x++) {
		const offset = Math.floor(x * step);
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
		cursor = Math.max(0, Math.min(input.length - 1, cursor));
		const x = Math.floor((view.width / input.length) * cursor);
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
	soundFixedQueue?: SoundFixedQueue;
	isLive?: boolean;
	size?: Size2D;
	performanceMonitor?: PerformanceMonitorRef | null;
};

export const Spectrogram: React.FC<SpectrogramProps> = (props) => {
	const {
		soundBuffer, soundFixedQueue, isLive, performanceMonitor,
		size = { width: 600, height: 1024 },
	} = props;
	const { theme } = useTheme();
	const classes = useSpectrogramClasses();

	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();

	const info = useMemo(() => {
		if (!canvas) return null;
		canvas.width = size.width;
		canvas.height = size.height;
		const context = canvas.getContext('2d');
		if (!context) return null;
		const image = context.getImageData(0, 0, size.width, size.height);
		const layout: Layout2D = {
			position: { x: 0, y: 0 },
			view: size,
			frame: size,
			colorTheme: theme.color,
		};
		const windowSize = size.height * 2;
		const fft = createFft(windowSize);
		return { context, image, windowSize, fft, layout };
	}, [canvas, size, theme]);

	useAnimation(() => {
		if (!info) return;
		performanceMonitor?.begin();
		const { context, image, windowSize, fft, layout } = info;

		const buffer = isLive && soundFixedQueue ? soundFixedQueue.buffers[0] : soundBuffer.buffers[0];
		const cursor = isLive && soundFixedQueue ? undefined : Math.floor((soundBuffer.cursor / windowSize) + 0.5);

		const frequencies: Float32Array[] = [];
		const step = windowSize / 4;
		const count = 1 + Math.floor((buffer.length - windowSize) / step);
		for (let i = 0; i < count; i++) {
			const array = new Float32Array(windowSize / 2);
			frequencies.push(array);
		}
		fft.frequencies(buffer, frequencies, step);
		drawSpectrogram(frequencies, image.data, layout, cursor);
		context.putImageData(image, 0, 0);

		performanceMonitor?.end();
	}, [soundBuffer, soundFixedQueue, isLive, info, performanceMonitor]);

	const click = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
		if (isLive) return;
		const pos = getCanvasCursorPosition(e.currentTarget, e.nativeEvent);
		const val = Math.floor(pos.x * (soundBuffer.memorySize - 1));
		soundBuffer.cursor = val;
	}, [soundBuffer, isLive]);

	return (
		<canvas className={classes.root} ref={setCanvas} {...size} onClick={click} />
	);
};
