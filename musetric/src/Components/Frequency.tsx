/* eslint-disable max-len */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { Layout2D, Size2D, PerformanceMonitorRef, DrawFrame, parseColorThemeRgb, startAnimation, Recorder, Theme } from '..';
import { theming, useTheme } from '../Contexts';

export const drawFrequency = (
	input: Uint8Array,
	output: Uint8ClampedArray,
	layout: Layout2D,
): void => {
	const { position, view, frame, colorTheme } = layout;

	const { content, background } = parseColorThemeRgb(colorTheme);

	const step = (1.0 * input.length) / view.width;
	const count = Math.max(Math.floor(step), 1);

	for (let x = 0; x < view.width; x++) {
		const offset = Math.floor(x * step);
		let magnitude = 0;
		for (let i = 0; i < count; i++) {
			magnitude += input[offset + i];
		}
		magnitude *= 1.0;
		magnitude /= count;
		magnitude /= 255;

		for (let y = 0; y < view.height; y++) {
			const yIndex = 4 * (position.y + y) * frame.width;
			const index = 4 * (position.x + x) + yIndex;
			const isDraw = (magnitude * view.height) > view.height - y - 1;
			const color = isDraw ? content : background;
			output[index + 0] = color.r;
			output[index + 1] = color.g;
			output[index + 2] = color.b;
			output[index + 3] = 255;
		}
	}
};

export const getFrequencyStyles = (theme: Theme) => ({
	root: {
		display: 'block',
		background: theme.color.app,
		width: '100%',
		height: '100%',
	},
});

export const useFrequencyStyles = createUseStyles(getFrequencyStyles, { name: 'Frequency', theming });

export type FrequencyProps = {
	recorder: Recorder;
	performanceMonitor?: PerformanceMonitorRef | null;
};

export const Frequency: React.FC<FrequencyProps> = (props) => {
	const { recorder, performanceMonitor } = props;
	const theme = useTheme();
	const classes = useFrequencyStyles();

	const { mediaStream } = recorder;

	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

	const frame: Size2D = useMemo(() => ({
		width: 800,
		height: 400,
	}), []);

	const [analyserNode, audioData] = useMemo(() => {
		const audioContext = new AudioContext();
		const source = audioContext.createMediaStreamSource(mediaStream);
		const analyserNodeR = audioContext.createAnalyser();
		analyserNodeR.fftSize = 2048;
		source.connect(analyserNodeR);
		const audioDataR = new Uint8Array(analyserNodeR.frequencyBinCount);
		return [analyserNodeR, audioDataR];
	}, [mediaStream]);

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
			performanceMonitor?.begin();
			analyserNode.getByteFrequencyData(audioData);

			drawFrequency(audioData, image.data, layout);
			context.putImageData(image, 0, 0);

			performanceMonitor?.end();
		};
	}, [analyserNode, theme, context, image, audioData, frame, performanceMonitor]);

	useEffect(() => {
		const subscription = startAnimation(draw);
		return () => subscription.stop();
	}, []);

	return (
		<canvas className={classes.root} ref={setCanvas} width={frame.width} height={frame.height} />
	);
};
