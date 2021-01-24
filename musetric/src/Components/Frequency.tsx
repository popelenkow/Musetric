import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { Rendering, AudioDevices } from '..';
import { theming, Theme, useTheme } from '../Contexts/Theme';

export const getStyles = (theme: Theme) => ({
	root: {
		display: 'block',
		background: theme.contentBg,
		width: '100%',
		height: '100%',
	},
});

export const useStyles = createUseStyles(getStyles, { name: 'Frequency', theming });

export type Props = {
	recorderDevice: AudioDevices.RecorderDevice;
};

export const View: React.FC<Props> = (props) => {
	const { recorderDevice } = props;
	const theme = useTheme();
	const classes = useStyles();

	const { mediaStream } = recorderDevice;

	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

	const frame: Rendering.Size = useMemo(() => ({
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

	const fpsMonitor = useRef(Rendering.createFpsMonitor());

	const draw = useRef<Rendering.DrawFrame>();

	useEffect(() => {
		if (!context) return;
		if (!image) return;

		const colors = Rendering.parseHslColors(theme);
		if (!colors) return;

		const contentLayout: Rendering.Layout = {
			position: { x: 0, y: 0 },
			view: { width: frame.width, height: frame.height },
			frame,
			colors,
		};

		const fpsLayout: Rendering.Layout = {
			position: { x: 0, y: 0 },
			view: { width: frame.width / 20, height: frame.height / 12 },
			frame,
			colors,
		};

		draw.current = (delta) => {
			analyserNode.getByteFrequencyData(audioData);

			Rendering.drawFrequency(audioData, image.data, contentLayout);
			context.putImageData(image, 0, 0);

			fpsMonitor.current.setDelta(delta);
			fpsMonitor.current.draw(context, fpsLayout);
		};
	}, [analyserNode, theme, context, image, audioData, frame]);

	useEffect(() => {
		const subscription = Rendering.startAnimation(draw);
		return () => subscription.stop();
	}, []);

	return (
		<canvas className={classes.root} ref={setCanvas} width={frame.width} height={frame.height} />
	);
};
