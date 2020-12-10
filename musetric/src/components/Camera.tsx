import React, { useRef, useEffect } from 'react';
import { OrthographicCamera } from 'three';
import { useThree, Vector3 } from 'react-three-fiber';

export type CameraProps = {
	position: Vector3;
}
export const Camera: React.FC<CameraProps> = (props) => {
	const ref = useRef<OrthographicCamera>();
	const { setDefaultCamera } = useThree();

	useEffect(() => {
		if (!ref.current) return;
		setDefaultCamera(ref.current);
	}, [ref, setDefaultCamera]);

	return <orthographicCamera ref={ref} {...props} />;
};
