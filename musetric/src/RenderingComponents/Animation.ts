import { useRef, useEffect, DependencyList } from 'react';
import { DrawFrame, startAnimation } from '../Rendering/Animation';

export const useAnimation = (draw: DrawFrame, deps: DependencyList) => {
	const drawRef = useRef<DrawFrame>();

	useEffect(() => {
		drawRef.current = draw;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	useEffect(() => {
		const subscription = startAnimation(() => drawRef.current);
		return () => subscription.stop();
	}, []);
};
