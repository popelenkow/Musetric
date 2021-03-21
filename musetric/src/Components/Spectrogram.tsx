/* eslint-disable max-len */
import React, { useMemo, useState, useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import { createFft, Layout2D, parseColorThemeRgb, Size2D, PerformanceMonitorRef, SoundBuffer, Theme, getCanvasCursorPosition, useAnimation } from '..';
import { theming, useTheme } from '../Contexts';

export const getSpectrogramStyles = (theme: Theme) => ({
	root: {
		display: 'block',
		background: theme.color.app,
		width: '100%',
		height: '100%',
	},
});

export const useSpectrogramStyles = createUseStyles(getSpectrogramStyles, { name: 'Spectrogram', theming });

export const drawSpectrogram = (
	input: Float32Array[],
	output: Uint8ClampedArray,
	cursor: number,
	layout: Layout2D,
): void => {
	const { frame, view, position, colorTheme } = layout;

	const { content, background } = parseColorThemeRgb(colorTheme);

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

	{
		cursor = Math.max(0, Math.min(input.length - 1, cursor));
		const x = Math.floor((view.width / input.length) * cursor);
		const color = content;
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
	size?: Size2D;
	performanceMonitor?: PerformanceMonitorRef | null;
};

export const Spectrogram: React.FC<SpectrogramProps> = (props) => {
	const {
		soundBuffer, performanceMonitor,
		size = { width: 600, height: 1024 },
	} = props;
	const { theme } = useTheme();
	const classes = useSpectrogramStyles();

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

		const buffer = soundBuffer.buffers[0];

		const frequencies: Float32Array[] = [];
		const count = Math.floor(buffer.length / windowSize);
		for (let i = 0; i < count; i++) {
			const array = new Float32Array(windowSize / 2);
			frequencies.push(array);
		}
		fft.frequencies(buffer, frequencies);
		const cursor = Math.floor((soundBuffer.cursor / windowSize) + 0.5);
		drawSpectrogram(frequencies, image.data, cursor, layout);
		context.putImageData(image, 0, 0);

		performanceMonitor?.end();
	}, [soundBuffer, info, performanceMonitor]);

	const click = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
		const pos = getCanvasCursorPosition(e.currentTarget, e.nativeEvent);
		const val = Math.floor(pos.x * (soundBuffer.memorySize - 1));
		soundBuffer.cursor = val;
	}, [soundBuffer]);

	return (
		<canvas className={classes.root} ref={setCanvas} {...size} onClick={click} />
	);
};
