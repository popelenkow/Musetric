/* eslint-disable max-len */
/* eslint-disable consistent-return */
import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { drawFrequency } from './Model';
import { Contexts, CanvasHelpers } from '../..';

export type Props = {
	mediaStream: MediaStream;
};

export const View: React.FC<Props> = (props) => {
	const { mediaStream } = props;

	const width = 400;
	const height = 400;

	const [analyserNode, recorderData] = useMemo(() => {
		const audioContext = new AudioContext();
		const source = audioContext.createMediaStreamSource(mediaStream);
		const analyserNodeR = audioContext.createAnalyser();
		analyserNodeR.fftSize = 2048;
		source.connect(analyserNodeR);
		const recorderDataR = new Uint8Array(analyserNodeR.frequencyBinCount);
		return [analyserNodeR, recorderDataR];
	}, [mediaStream]);

	const { appElement, theme } = useContext(Contexts.App.Context);
	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

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
			if (!image.data) return;
			analyserNode.getByteFrequencyData(recorderData);
			drawFrequency({ recorderData, viewData: image.data, width, height, backgroundColor, contentColor });
			ctx.putImageData(image, 0, 0);
			fpsMonitor.setDelta(delta);
			fpsMonitor.draw(ctx, backgroundColor, contentColor);
		};
	}, [mediaStream, analyserNode, appElement, theme, ctx, fpsMonitor, image, recorderData]);

	useEffect(() => {
		const subscription = CanvasHelpers.startAnimation(draw);
		return () => subscription.stop();
	}, []);

	return (
		<canvas className='WaveGraph' ref={setCanvas} width={width} height={height} />
	);
};
