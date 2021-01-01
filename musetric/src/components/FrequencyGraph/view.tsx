import React, { useRef, useContext } from 'react';
import { Color, RGBFormat, DataTexture, Mesh } from 'three';
import { useFrame } from 'react-three-fiber';
import { drawFrequency } from './model';
import { Camera, Canvas } from '..';
import { Contexts } from '../..';
import { getColor } from '../getColor';

type PureProps = {
	zIndex: number;
	analyserNode: AnalyserNode;
};

const PureView: React.FC<PureProps> = (props) => {
	const { analyserNode, zIndex } = props;

	const { appElement } = useContext(Contexts.App.Context);
	const { canvas } = useContext(Contexts.Canvas.Context);

	const mesh = useRef<Mesh>();

	const width = 100;
	const height = 100;
	const viewData = new Uint8Array(3 * width * height);
	const recorderData = new Uint8Array(analyserNode.frequencyBinCount);
	const texture = new DataTexture(viewData, width, height, RGBFormat);

	useFrame(() => {
		if (!appElement) return;
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
	analyserNode: AnalyserNode;
};

export const View: React.FC<Props> = (props) => {
	const { analyserNode } = props;
	return (
		<Canvas.View>
			<Camera.View position={[0, 0, 0.1]} />
			<PureView zIndex={0} analyserNode={analyserNode} />
		</Canvas.View>
	);
};
