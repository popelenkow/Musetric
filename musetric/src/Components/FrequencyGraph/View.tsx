import React, { useRef, useContext, useMemo } from 'react';
import { Color, RGBFormat, DataTexture, Mesh } from 'three';
import { useFrame } from 'react-three-fiber';
import { drawFrequency } from './Model';
import { Camera, Canvas } from '..';
import { Contexts } from '../..';
import { getColor } from '../getColor';

type PureProps = {
	zIndex: number;
	mediaStream: MediaStream;
};

const PureView: React.FC<PureProps> = (props) => {
	const { mediaStream, zIndex } = props;

	const { appElement } = useContext(Contexts.App.Context);
	const { canvas } = useContext(Contexts.Canvas.Context);

	const mesh = useRef<Mesh>();

	const width = 100;
	const height = 100;
	const viewData = new Uint8Array(3 * width * height);
	const texture = new DataTexture(viewData, width, height, RGBFormat);

	const [analyserNode, recorderData] = useMemo(() => {
		const audioContext = new AudioContext();
		const source = audioContext.createMediaStreamSource(mediaStream);
		const analyserNodeR = audioContext.createAnalyser();
		analyserNodeR.fftSize = 2048;
		source.connect(analyserNodeR);
		const recorderDataR = new Uint8Array(analyserNodeR.frequencyBinCount);
		return [analyserNodeR, recorderDataR];
	}, [mediaStream]);

	useFrame(() => {
		if (!appElement) return;
		if (!analyserNode) return;
		analyserNode.getByteFrequencyData(recorderData);
		const backgroundColor = getColor(appElement, '--color__contentBg') as Color;
		const contentColor = getColor(appElement, '--color__content') as Color;
		drawFrequency({ recorderData, viewData, width, height, backgroundColor, contentColor });

		texture.needsUpdate = true;
	});

	if (!canvas) return null;

	return (
		<mesh ref={mesh} position={[0, 0, zIndex]}>
			<planeBufferGeometry args={[canvas.size.width, canvas.size.height]} />
			<meshBasicMaterial map={texture} />
		</mesh>
	);
};

export type Props = {
	mediaStream: MediaStream;
};

export const View: React.FC<Props> = (props) => {
	const { mediaStream } = props;

	return (
		<Canvas.View>
			<Camera.View position={[0, 0, 0.1]} />
			<PureView zIndex={0} mediaStream={mediaStream} />
		</Canvas.View>
	);
};
