import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Contexts, Rendering } from '../..';

export type Props = {
	mediaStream: MediaStream;
};

export const View: React.FC<Props> = (props) => {
	const { mediaStream } = props;

	const { appElement, theme } = useContext(Contexts.App.Context);
	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

	const frame: Rendering.Size = useMemo(() => ({
		width: 400,
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
		if (!appElement) return;
		if (!context) return;
		if (!image) return;
		if (!theme) return;

		const colors = Rendering.getColors(appElement);
		if (!colors) return;

		const contentLayout: Rendering.Layout = {
			position: { x: 0, y: 0 },
			view: frame,
			frame,
			colors,
		};

		const fpsLayout: Rendering.Layout = {
			position: { x: 0, y: 0 },
			view: { width: 0, height: 0 },
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
	}, [analyserNode, appElement, theme, context, image, audioData, frame]);

	useEffect(() => {
		const subscription = Rendering.startAnimation(draw);
		return () => subscription.stop();
	}, []);

	return (
		<canvas className='FrequencyGraph' ref={setCanvas} width={frame.width} height={frame.height} />
	);
};
