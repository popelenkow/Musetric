import { MutableRefObject } from 'react';

export type DrawFrame = (delta: number) => void;
export type RefDrawFrame = MutableRefObject<DrawFrame | undefined>;
export type AnimationSubscription = { stop: () => void };

export const startAnimation = (draw: RefDrawFrame): AnimationSubscription => {
	let id: number;
	let time = 0;
	const loop = (curTime: number) => {
		if (draw.current) draw.current(curTime - time);
		time = curTime;
		id = requestAnimationFrame(loop);
	};
	id = requestAnimationFrame(loop);
	return { stop: () => cancelAnimationFrame(id) };
};
