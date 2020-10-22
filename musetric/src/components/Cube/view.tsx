import React, { useRef, useState, useContext, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, CanvasContext, useFrame } from 'react-three-fiber';
import { Contexts } from '../..';
import { getColor } from './getColor';

const Box: React.FC<any> = (props) => {
	// This reference will give us direct access to the mesh
	const mesh = useRef<THREE.Mesh>();

	// Set up state for the hovered and active state
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);

	// Rotate mesh every frame, this is outside of React without overhead
	useFrame(() => {
		if (!mesh.current) return;
		mesh.current.rotation.x += 0.01;
		mesh.current.rotation.y += 0.01;
	});

	return (
		<mesh
			{...props}
			ref={mesh}
			scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
			onClick={() => setActive(!active)}
			onPointerOver={() => setHover(true)}
			onPointerOut={() => setHover(false)}
		>
			<boxBufferGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
		</mesh>
	);
};

export type Props = {
	app: HTMLElement;
}

export const View: React.FC<Props> = (props) => {
	const { app } = props;
	const { theme } = useContext(Contexts.AppContext.Context);

	const [canvas, setCanvas] = useState<CanvasContext>();

	useEffect(() => {
		if (!theme) return;
		if (!canvas) return;
		const rgb = getColor(app, '--color__contentBg');
		const color = rgb ? new THREE.Color(rgb[0], rgb[1], rgb[2]) : new THREE.Color(0, 0, 0);
		canvas.gl.setClearColor(color);
	}, [theme, canvas, app]);

	return (
		<Canvas onCreated={setCanvas}>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<Box position={[-1.2, 0, 0]} />
			<Box position={[1.2, 0, 0]} />
		</Canvas>
	);
};
