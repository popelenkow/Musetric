import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { Layout2D, Size2D, createFpsMonitor, DrawFrame, parseColorThemeRgb, startAnimation, SoundBuffer, Theme } from '..';
import { theming, useTheme } from '../Contexts';

export const drawWaveform = (
	input: Float32Array,
	output: Uint8ClampedArray,
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
};

export const getWaveformStyles = (theme: Theme) => ({
	root: {
		display: 'block',
		background: theme.color.app,
		width: '100%',
		height: '100%',
	},
});

export const useWaveformStyles = createUseStyles(getWaveformStyles, { name: 'Waveform', theming });

export type WaveformProps = {
	soundBuffer: SoundBuffer;
};

export const Waveform: React.FC<WaveformProps> = (props) => {
	const { soundBuffer } = props;
	const theme = useTheme();
	const classes = useWaveformStyles();

	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();

	const frame: Size2D = useMemo(() => ({
		width: 1200,
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

	const fpsMonitor = useRef(createFpsMonitor());

	const draw = useRef<DrawFrame>();

	useEffect(() => {
		if (!context) return;
		if (!image) return;

		const contentLayout: Layout2D = {
			position: { x: 0, y: 0 },
			view: { width: frame.width, height: frame.height },
			frame,
			colorTheme: theme.color,
		};

		const fpsLayout: Layout2D = {
			position: { x: 0, y: 0 },
			view: { width: frame.width / 20, height: frame.height / 12 },
			frame,
			colorTheme: theme.color,
		};

		draw.current = (delta) => {
			drawWaveform(soundBuffer.buffers[0], image.data, contentLayout);
			context.putImageData(image, 0, 0);

			fpsMonitor.current.setDelta(delta);
			fpsMonitor.current.draw(context, fpsLayout);
		};
	}, [soundBuffer, theme, fpsMonitor, context, image, frame]);

	useEffect(() => {
		const subscription = startAnimation(draw);
		return () => subscription.stop();
	}, []);

	return (
		<canvas className={classes.root} ref={setCanvas} width={frame.width} height={frame.height} />
	);
};
