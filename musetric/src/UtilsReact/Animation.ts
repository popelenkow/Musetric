import { useRef, useEffect } from 'react';
import { AnimationCallback, startAnimation, StopAnimation } from '../Rendering/Animation';

export const useAnimationCallback = (
	callback?: AnimationCallback,
): void => {
	type Ref = {
		callback?: AnimationCallback,
		stopAnimation?: StopAnimation,
	};
	const ref = useRef<Ref>({});

	if (callback && !ref.current.stopAnimation) {
		ref.current.callback = callback;
		ref.current.stopAnimation = startAnimation((...args) => {
			ref.current.callback?.(...args);
		});
	}
	else if (!callback && ref.current.stopAnimation) {
		ref.current.stopAnimation();
		ref.current.stopAnimation = undefined;
	}
	else {
		ref.current.callback = callback;
	}

	useEffect(() => {
		return () => {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			ref.current.stopAnimation?.();
		};
	}, []);
};

export const useAnimation = (
	createCallback: () => AnimationCallback | undefined,
): void => {
	useAnimationCallback(createCallback());
};
