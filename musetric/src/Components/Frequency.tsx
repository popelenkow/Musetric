/* eslint-disable max-len */
import React, { useState, useMemo } from 'react';
import {
	Theme, createUseClasses, useTheme, parseColorThemeRgb,
	Layout2D, Size2D, useAnimation,
	PerformanceMonitorRef, SoundBuffer, SoundFixedQueue, createFft,
} from '..';

export const getFrequencyClasses = (theme: Theme) => ({
	root: {
		display: 'block',
		background: theme.color.app,
		width: '100%',
		height: '100%',
	},
});

export const useFrequencyClasses = createUseClasses('Frequency', getFrequencyClasses);

export const drawFrequency = (
	input: Float32Array,
	output: Uint8ClampedArray,
	layout: Layout2D,
): void => {
	const { position, view, frame, colorTheme } = layout;

	const { content, background } = parseColorThemeRgb(colorTheme);

	const step = (1.0 * input.length) / view.width;

	for (let x = 0; x < view.width; x++) {
		const offset = Math.floor(x * step);
		const value = Math.log10(input[offset]) / 5;
		const magnitude = Math.max(0, Math.min(1, value + 1));

		for (let y = 0; y < view.height; y++) {
			const yIndex = 4 * (position.y + y) * frame.width;
			const index = 4 * (position.x + x) + yIndex;
			const isDraw = view.height - y - 1 < magnitude * view.height;
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
	soundFixedQueue?: SoundFixedQueue;
	isLive?: boolean;
	size?: Size2D;
	performanceMonitor?: PerformanceMonitorRef | null;
};

export const Frequency: React.FC<FrequencyProps> = (props) => {
	const {
		soundBuffer, soundFixedQueue, isLive, performanceMonitor,
		size = { width: 1024, height: 400 },
	} = props;
	const { theme } = useTheme();
	const classes = useFrequencyClasses();

	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

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
		const windowSize = size.width * 2;
		const fft = createFft(windowSize);
		const result = new Float32Array(size.width);
		return { context, image, layout, windowSize, fft, result };
	}, [canvas, size, theme]);

	useAnimation(() => {
		if (!info) return;
		performanceMonitor?.begin();
		const { context, image, layout, windowSize, fft, result } = info;

		const { cursor, memorySize, buffers } = isLive && soundFixedQueue ? { ...soundFixedQueue, cursor: soundFixedQueue.memorySize } : soundBuffer;
		const offset = cursor + windowSize < memorySize ? cursor : memorySize - windowSize;
		fft.frequency(buffers[0], result, offset);
		drawFrequency(result, image.data, layout);
		context.putImageData(image, 0, 0);

		performanceMonitor?.end();
	}, [soundBuffer, soundFixedQueue, isLive, info, performanceMonitor]);

	return (
		<canvas className={classes.root} ref={setCanvas} {...size} />
	);
};
