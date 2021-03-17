/* eslint-disable max-len */
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import { Layout2D, Size2D, DrawFrame, parseColorThemeRgb, startAnimation, SoundBuffer, Theme, PerformanceMonitorRef, getCanvasCursorPosition } from '..';
import { theming, useTheme } from '../Contexts';

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

	if (cursor < input.length) {
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

export const getWaveformStyles = (theme: Theme) => ({
	root: {
		background: theme.color.app,
		width: '100%',
		height: '100%',
	},
	canvas: {
		display: 'block',
		width: '100%',
		height: '100%',
	},
});

export const useWaveformStyles = createUseStyles(getWaveformStyles, { name: 'Waveform', theming });

export type WaveformProps = {
	soundBuffer: SoundBuffer;
	performanceMonitor?: PerformanceMonitorRef | null;
};

export const Waveform: React.FC<WaveformProps> = (props) => {
	const { soundBuffer, performanceMonitor } = props;
	const theme = useTheme();
	const classes = useWaveformStyles();

	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();

	const isEnabled = useCallback(() => soundBuffer.soundSize !== 0, [soundBuffer]);

	const frame: Size2D = useMemo(() => ({
		width: 600,
		height: 800,
	}), []);

	const [context, image] = useMemo(() => {
		if (!canvas) return [];
		canvas.width = frame.width;
		canvas.height = frame.height;
		const ctx = canvas.getContext('2d');
		if (!ctx) return [];
		const tmpImage = ctx.getImageData(0, 0, frame.width, frame.height);
		return [ctx, tmpImage];
	}, [canvas, frame]);

	const draw = useRef<DrawFrame>();

	useEffect(() => {
		if (!context) return;
		if (!image) return;

		const layout: Layout2D = {
			position: { x: 0, y: 0 },
			view: { width: frame.width, height: frame.height },
			frame,
			colorTheme: theme.color,
		};

		draw.current = () => {
			if (!isEnabled()) return;
			performanceMonitor?.begin();
			drawWaveform(soundBuffer.buffers[0], image.data, soundBuffer.cursor, layout);
			context.putImageData(image, 0, 0);

			performanceMonitor?.end();
		};
	}, [soundBuffer, theme, context, image, frame, performanceMonitor, isEnabled]);

	useEffect(() => {
		const subscription = startAnimation(draw);
		return () => subscription.stop();
	}, []);

	const click = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!isEnabled()) return;
		const pos = getCanvasCursorPosition(e.currentTarget, e.nativeEvent);
		const val = Math.floor(pos.x * (soundBuffer.memorySize - 1));
		soundBuffer.cursor = val;
	}, [isEnabled, soundBuffer]);

	return (
		<div className={classes.root}>
			<canvas className={classes.canvas} ref={setCanvas} width={frame.width} height={frame.height} onClick={click} />
		</div>
	);
};
