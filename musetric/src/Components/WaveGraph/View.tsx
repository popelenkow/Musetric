/* eslint-disable consistent-return */
/* eslint-disable max-len */
import React, { useContext, useMemo, useState, useEffect, useRef } from 'react';
import { drawWave } from './Model';
import { Contexts, CanvasHelpers } from '../..';

export type Props = {
	state: { audioData?: Float32Array };
};

export const View: React.FC<Props> = (props) => {
	const { state } = props;

	const { appElement, theme } = useContext(Contexts.App.Context);
	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();

	const width = 2000;
	const height = 1000;
	const [ctx, image] = useMemo(() => {
		if (!canvas) return [];
		canvas.width = width;
		canvas.height = height;
		const tmpCtx = canvas.getContext('2d');
		if (!tmpCtx) return [];
		const tmpImage = tmpCtx.getImageData(0, 0, width, height);
		return [tmpCtx, tmpImage];
	}, [canvas]);
	const fpsMonitor = useMemo(() => CanvasHelpers.createFpsMonitor(), []);

	const draw = useRef<CanvasHelpers.DrawFrame>();

	useEffect(() => {
		if (!appElement) return;
		if (!ctx) return;
		if (!image) return;
		if (!theme) return;

		const backgroundColor = CanvasHelpers.getColor(appElement, '--color__contentBg');
		const contentColor = CanvasHelpers.getColor(appElement, '--color__content');
		if (!backgroundColor) return;
		if (!contentColor) return;

		draw.current = (delta) => {
			const { audioData } = state;
			if (!audioData) return;

			fpsMonitor.setDelta(delta);
			drawWave({ audioData, viewData: image.data, width, height, backgroundColor, contentColor });

			ctx.putImageData(image, 0, 0);
			fpsMonitor.draw(ctx, backgroundColor, contentColor);
		};
	}, [state, appElement, theme, fpsMonitor, ctx, image]);

	useEffect(() => {
		const subscription = CanvasHelpers.startAnimation(draw);
		return () => subscription.stop();
	}, []);

	return (
		<canvas className='WaveGraph' ref={setCanvas} width={width} height={height} />
	);
};
