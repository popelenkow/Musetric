import React, { useRef, useState, useContext, useEffect } from 'react';
import { Color, Mesh } from 'three';
import { Canvas, CanvasContext, useFrame } from 'react-three-fiber';
import { Contexts } from '../..';
import { getColor } from '../getColor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Box: React.FC<any> = (props) => {
	// This reference will give us direct access to the mesh
	const mesh = useRef<Mesh>();

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
};

export const View: React.FC<Props> = () => {
	const { appElement, theme } = useContext(Contexts.App.Context);

	const [canvas, setCanvas] = useState<CanvasContext>();

	useEffect(() => {
		if (!theme) return;
		if (!canvas) return;
		if (!appElement) return;
		const c = getColor(appElement, '--color__contentBg');
		canvas.gl.setClearColor(c || new Color(0, 0, 0));
	}, [theme, canvas, appElement]);

	return (
		<Canvas onCreated={setCanvas}>
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<Box position={[-1.2, 0, 0]} />
			<Box position={[1.2, 0, 0]} />
		</Canvas>
	);
};
