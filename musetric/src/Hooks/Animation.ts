import { useRef, useEffect, DependencyList } from 'react';
import { AnimationCallback, startAnimation } from '../Rendering/Animation';

export const useAnimation = (callback: AnimationCallback, deps: DependencyList): void => {
	const callbackRef = useRef<AnimationCallback>();

	useEffect(() => {
		callbackRef.current = callback;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	useEffect(() => {
		const subscription = startAnimation((...args) => {
			if (callbackRef.current) callbackRef.current(...args);
		});
		return () => subscription.stop();
	}, []);
};
