import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { Rendering } from '..';
import { theming, Theme, useTheme } from '../Contexts/Theme';

export const getStyles = (theme: Theme) => ({
	root: {
		display: 'block',
		background: theme.contentBg,
		width: '100%',
		height: '100%',
	},
});

export const useStyles = createUseStyles(getStyles, { name: 'Sonogram', theming });

export type Props = {
	state: { audioData?: Float32Array };
};

export const View: React.FC<Props> = (props) => {
	const { state } = props;
	const theme = useTheme();
	const classes = useStyles();

	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();

	const frame: Rendering.Size = useMemo(() => ({
		width: 1600,
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
			const { audioData } = state;
			if (!audioData) return;

			Rendering.drawSonogram(audioData, image.data, contentLayout);
			context.putImageData(image, 0, 0);

			fpsMonitor.current.setDelta(delta);
			fpsMonitor.current.draw(context, fpsLayout);
		};
	}, [state, theme, fpsMonitor, context, image, frame]);

	useEffect(() => {
		const subscription = Rendering.startAnimation(draw);
		return () => subscription.stop();
	}, []);

	return (
		<canvas className={classes.root} ref={setCanvas} width={frame.width} height={frame.height} />
	);
};
