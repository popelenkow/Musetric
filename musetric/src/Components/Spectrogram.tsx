/* eslint-disable max-len */
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { createFft, Layout2D, parseColorThemeRgb, Size2D, PerformanceMonitorRef, DrawFrame, startAnimation, SoundBuffer, Theme } from '..';
import { theming, useTheme } from '../Contexts';

export const drawSpectrogram = (
	input: Float32Array[],
	output: Uint8ClampedArray,
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
};

export const getSpectrogramStyles = (theme: Theme) => ({
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

export const useSpectrogramStyles = createUseStyles(getSpectrogramStyles, { name: 'Spectrogram', theming });

export type SpectrogramProps = {
	soundBuffer: SoundBuffer;
	performanceMonitor?: PerformanceMonitorRef | null;
};

export const Spectrogram: React.FC<SpectrogramProps> = (props) => {
	const { soundBuffer, performanceMonitor } = props;
	const theme = useTheme();
	const classes = useSpectrogramStyles();

	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();

	const frame: Size2D = useMemo(() => ({
		width: 600,
		height: 1024,
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

		const windowSize = frame.height * 2;
		const fft = createFft(windowSize);

		draw.current = () => {
			if (soundBuffer.soundSize === 0) return;
			performanceMonitor?.begin();

			const layout: Layout2D = {
				position: { x: 0, y: 0 },
				view: { width: frame.width, height: frame.height },
				frame,
				colorTheme: theme.color,
			};

			const audioData = soundBuffer.buffers[0];

			const frequencies: Float32Array[] = [];
			const count = Math.floor(audioData.length / windowSize);
			for (let i = 0; i < count; i++) {
				const array = new Float32Array(windowSize / 2);
				frequencies.push(array);
			}
			fft.getFrequencies(audioData, frequencies);
			drawSpectrogram(frequencies, image.data, layout);
			context.putImageData(image, 0, 0);

			performanceMonitor?.end();
		};
	}, [soundBuffer, theme, context, image, frame, performanceMonitor]);

	useEffect(() => {
		const subscription = startAnimation(draw);
		return () => subscription.stop();
	}, []);

	return (
		<div className={classes.root}>
			<canvas className={classes.canvas} ref={setCanvas} width={frame.width} height={frame.height} />
		</div>
	);
};
