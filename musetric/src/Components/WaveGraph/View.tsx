/* eslint-disable consistent-return */
/* eslint-disable max-len */
import React, { useContext, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { drawWave } from './Model';
import { Contexts, CanvasHelpers } from '../..';

export type Props = {
	state: { audioData?: Float32Array };
};

export const View: React.FC<Props> = (props) => {
	const { state } = props;

	const { appElement } = useContext(Contexts.App.Context);
	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();

	const width = 2000;
	const height = 1000;
	const [ctx, image] = useMemo(() => {
		if (!canvas) return [];
		canvas.width = width;
		canvas.height = height;
		const tmpCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
		const tmpImage = tmpCtx.getImageData(0, 0, width, height);
		return [tmpCtx, tmpImage];
	}, [canvas]);
	const fpsMonitor = useMemo(() => CanvasHelpers.createFpsMonitor(), []);

	useEffect(() => {
		if (!appElement) return;
		if (!ctx) return;
		if (!image) return;

		const backgroundColor = CanvasHelpers.getColor(appElement, '--color__contentBg') as THREE.Color;
		const contentColor = CanvasHelpers.getColor(appElement, '--color__content') as THREE.Color;

		const sub = CanvasHelpers.startAnimation((delta) => {
			const { audioData } = state;
			if (!audioData) return;

			fpsMonitor.setDelta(delta);
			drawWave({ audioData, viewData: image.data, width, height, backgroundColor, contentColor });

			ctx.putImageData(image, 0, 0);
			fpsMonitor.draw(ctx);
		});
		return () => sub.stop();
	}, [state, appElement, fpsMonitor, ctx, image]);

	return (
		<canvas className='WaveGraph' ref={setCanvas} width={width} height={height} />
	);
};
