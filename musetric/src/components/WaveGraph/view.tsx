import React, { useRef, useContext, useMemo } from 'react';
import { Color, RGBFormat, DataTexture, Mesh } from 'three';
import { useFrame } from 'react-three-fiber';
import { drawWave } from './model';
import { Camera, Canvas } from '..';
import { Contexts } from '../..';
import { getColor } from '../getColor';

type PureProps = {
	zIndex: number;
	audioData: Float32Array;
};

const PureView: React.FC<PureProps> = (props) => {
	const { audioData, zIndex } = props;

	const { appElement } = useContext(Contexts.App.Context);
	const { canvas } = useContext(Contexts.Canvas.Context);

	const mesh = useRef<Mesh>();

	const width = 2000;
	const height = 1000;
	const viewData = useMemo(() => new Uint8Array(3 * width * height), []);
	const texture = useMemo(() => new DataTexture(viewData, width, height, RGBFormat), [viewData]);

	useFrame(() => {
		if (!appElement) return;
		const backgroundColor = getColor(appElement, '--color__contentBg') as Color;
		const contentColor = getColor(appElement, '--color__content') as Color;
		drawWave({ audioData, viewData, width, height, backgroundColor, contentColor });

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
	audioData: Float32Array;
};

export const View: React.FC<Props> = (props) => {
	const { audioData } = props;

	return (
		<Canvas.View>
			<Camera.View position={[0, 0, 0.1]} />
			<PureView zIndex={0} audioData={audioData} />
		</Canvas.View>
	);
};
