/* eslint-disable max-len */
import React, { useMemo, useState, useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import { Layout2D, Size2D, parseColorThemeRgb, SoundBuffer, Theme, PerformanceMonitorRef, getCanvasCursorPosition, useAnimation } from '..';
import { theming, useTheme } from '../Contexts';

export const getWaveformStyles = (theme: Theme) => ({
	root: {
		display: 'block',
		background: theme.color.app,
		width: '100%',
		height: '100%',
	},
});

export const useWaveformStyles = createUseStyles(getWaveformStyles, { name: 'Waveform', theming });

export const drawWaveform = (
	input: Float32Array,
	output: Uint8ClampedArray,
	cursor: number,
	layout: Layout2D,
): void => {
	const { position, view, frame, colorTheme } = layout;

	const { content, background } = parseColorThemeRgb(colorTheme);

	const minArray = new Float32Array(view.width);
	const maxArray = new Float32Array(view.width);

	const step = input.length / view.width;
	for (let x = 0; x < view.width; x++) {
		let min = 1.0;
		let max = -1.0;
		const offset = Math.floor(x * step);
		for (let i = 0; i < step; i++) {
			const value = input[offset + i];
			if (value < min) min = value;
			if (value > max) max = value;
		}
		minArray[x] = min;
		maxArray[x] = max;
	}

	for (let x = 0; x < view.width; x++) {
		minArray[x] = (1 + minArray[x]) * (view.height / 2);
		maxArray[x] = (1 + maxArray[x]) * (view.height / 2);
	}

	for (let y = 0; y < view.height; y++) {
		const yIndex = 4 * (position.y + y) * frame.width;
		for (let x = 0; x < view.width; x++) {
			const index = 4 * (position.x + x) + yIndex;
			const max = maxArray[x];
			const min = minArray[x];
			const isDraw = (min <= y) && (y <= max);
			const color = isDraw ? content : background;
			output[index + 0] = color.r;
			output[index + 1] = color.g;
			output[index + 2] = color.b;
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

export type WaveformProps = {
	soundBuffer: SoundBuffer;
	size?: Size2D;
	performanceMonitor?: PerformanceMonitorRef | null;
};

export const Waveform: React.FC<WaveformProps> = (props) => {
	const {
		soundBuffer, performanceMonitor,
		size = { width: 800, height: 800 },
	} = props;
	const { theme } = useTheme();
	const classes = useWaveformStyles();

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
		return { context, image, layout };
	}, [canvas, size, theme]);

	useAnimation(() => {
		if (!info) return;
		performanceMonitor?.begin();
		const { context, image, layout } = info;

		drawWaveform(soundBuffer.buffers[0], image.data, soundBuffer.cursor, layout);
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
