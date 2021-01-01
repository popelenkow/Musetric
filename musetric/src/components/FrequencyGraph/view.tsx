import React, { useRef, useState, useContext, useEffect } from 'react';
import { Color, RGBFormat, DataTexture, Mesh } from 'three';
import { Canvas, CanvasContext, useFrame } from 'react-three-fiber';
import { drawFrequency } from './model';
import { Contexts } from '../..';
import { getColor } from '../getColor';
import { Camera } from '../Camera';

type PlaneProps = {
	appElement: HTMLElement;
	zIndex: number;
	analyserNode: AnalyserNode;
	canvas: CanvasContext;
};

const Plane: React.FC<PlaneProps> = (props) => {
	const { analyserNode, canvas, zIndex, appElement } = props;

	const mesh = useRef<Mesh>();

	const width = 100;
	const height = 100;
	const viewData = new Uint8Array(3 * width * height);
	const recorderData = new Uint8Array(analyserNode.frequencyBinCount);
	const texture = new DataTexture(viewData, width, height, RGBFormat);

	useFrame(() => {
		analyserNode.getByteFrequencyData(recorderData);
		const backgroundColor = getColor(appElement, '--color__contentBg') as Color;
		const contentColor = getColor(appElement, '--color__content') as Color;
		drawFrequency({ recorderData, viewData, width, height, backgroundColor, contentColor });

		texture.needsUpdate = true;
	});

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
	const { appElement, theme } = useContext(Contexts.App.Context);

	const [color, setColor] = useState<Color>(new Color(0, 0, 0));
	const [canvas, setCanvas] = useState<CanvasContext>();

	useEffect(() => {
		if (!theme) return;
		if (!appElement) return;
		const c = getColor(appElement, '--color__contentBg');
		setColor(c || new Color(0, 0, 0));
	}, [theme, appElement]);

	useEffect(() => {
		if (!canvas) return;
		canvas.gl.setClearColor(color);
	}, [color, canvas]);

	return (
		<Canvas onCreated={setCanvas} colorManagement={false}>
			<Camera position={[0, 0, 0.1]} />
			{canvas && appElement
				&& <Plane appElement={appElement} canvas={canvas} zIndex={0} analyserNode={analyserNode} />}
		</Canvas>
	);
};
