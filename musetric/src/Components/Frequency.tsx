/* eslint-disable max-len */
import React, { useState, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import { Layout2D, Size2D, PerformanceMonitorRef, parseColorThemeRgb, Recorder, Theme, useAnimation } from '..';
import { theming, useTheme } from '../Contexts';

export const getFrequencyStyles = (theme: Theme) => ({
	root: {
		display: 'block',
		background: theme.color.app,
		width: '100%',
		height: '100%',
	},
});

export const useFrequencyStyles = createUseStyles(getFrequencyStyles, { name: 'Frequency', theming });

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

export type FrequencyProps = {
	recorder: Recorder;
	size?: Size2D;
	performanceMonitor?: PerformanceMonitorRef | null;
};

export const Frequency: React.FC<FrequencyProps> = (props) => {
	const {
		recorder, performanceMonitor,
		size = { width: 600, height: 400 },
	} = props;
	const theme = useTheme();
	const classes = useFrequencyStyles();

	const { mediaStream } = recorder;

	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

	const [analyserNode, audioData] = useMemo(() => {
		const audioContext = new AudioContext();
		const source = audioContext.createMediaStreamSource(mediaStream);
		const analyserNodeR = audioContext.createAnalyser();
		analyserNodeR.fftSize = 2048;
		source.connect(analyserNodeR);
		const audioDataR = new Uint8Array(analyserNodeR.frequencyBinCount);
		return [analyserNodeR, audioDataR];
	}, [mediaStream]);

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
		analyserNode.getByteFrequencyData(audioData);

		drawFrequency(audioData, image.data, layout);
		context.putImageData(image, 0, 0);

		performanceMonitor?.end();
	}, [analyserNode, info, audioData, performanceMonitor]);

	return (
		<canvas className={classes.root} ref={setCanvas} {...size} />
	);
};
