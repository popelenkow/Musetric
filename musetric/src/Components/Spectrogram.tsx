import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { getFftFrequencies, Layout2D, parseHslColors, Size2D, createFpsMonitor, DrawFrame, startAnimation, SoundBuffer, Theme } from '..';
import { theming, useTheme } from '../Contexts';

const createNext = (N: number) => {
	let q = 0;
	let qq = 0;
	return (delta: number): boolean => {
		if (q === N + 1) return true;
		if (q !== 0) console.log(q.toString(), delta.toFixed(2));

		if (q === 1) qq = delta;
		else if (q > 1) qq += delta;

		if (q === N) {
			q++;
			qq /= N;
			console.log('res', qq.toFixed(2));
			return true;
		}
		q++;
		return false;
	};
};

export const drawSpectrogram = (
	input: Float32Array[],
	output: Uint8ClampedArray,
	layout: Layout2D,
): void => {
	const { frame, view, position, colors } = layout;
	const { background, content } = colors;

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
		display: 'block',
		background: theme.contentBg,
		width: '100%',
		height: '100%',
	},
});

export const useSpectrogramStyles = createUseStyles(getSpectrogramStyles, { name: 'Spectrogram', theming });

export type SpectrogramProps = {
	soundBuffer: SoundBuffer;
};

export const Spectrogram: React.FC<SpectrogramProps> = (props) => {
	const { soundBuffer } = props;
	const theme = useTheme();
	const classes = useSpectrogramStyles();

	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();

	const frame: Size2D = useMemo(() => ({
		width: 800,
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

	const fpsMonitor = useRef(createFpsMonitor());

	const draw = useRef<DrawFrame>();

	useEffect(() => {
		if (!context) return;
		if (!image) return;

		const colors = parseHslColors(theme);
		if (!colors) return;

		const next = createNext(10);
		draw.current = (delta) => {
			if (soundBuffer.soundSize === 0) return;
			if (next(delta)) return;

			const contentLayout: Layout2D = {
				position: { x: 0, y: 0 },
				view: { width: frame.width, height: frame.height },
				frame,
				colors,
			};

			const fpsLayout: Layout2D = {
				position: { x: 0, y: 0 },
				view: { width: frame.width / 20, height: frame.height / 12 },
				frame,
				colors,
			};

			const audioData = soundBuffer.buffers[0];
			const windowSize = frame.height * 2;
			const frequencies: Float32Array[] = [];
			const count = Math.floor(audioData.length / windowSize);
			for (let i = 0; i < count; i++) {
				const array = new Float32Array(windowSize / 2);
				frequencies.push(array);
			}
			getFftFrequencies(audioData, frequencies, windowSize);
			drawSpectrogram(frequencies, image.data, contentLayout);
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
