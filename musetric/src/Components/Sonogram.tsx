import React, { useContext, useMemo, useState, useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { Contexts, Rendering } from '..';

export const useStyles = createUseStyles({
	root: {
		display: 'block',
		background: 'var(--color__contentBg)',
		width: '100%',
		height: '100%',
	},
}, { name: 'Sonogram' });

export type Props = {
	state: { audioData?: Float32Array };
};

export const View: React.FC<Props> = (props) => {
	const { state } = props;
	const classes = useStyles();

	const { appElement, theme } = useContext(Contexts.App.Context);
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
		if (!appElement) return;
		if (!context) return;
		if (!image) return;
		if (!theme) return;

		const colors = Rendering.getColors(appElement);
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
	}, [state, appElement, theme, fpsMonitor, context, image, frame]);

	useEffect(() => {
		const subscription = Rendering.startAnimation(draw);
		return () => subscription.stop();
	}, []);

	return (
		<canvas className={classes.root} ref={setCanvas} width={frame.width} height={frame.height} />
	);
};
