import { MutableRefObject } from 'react';

export type DrawFrame = (delta: number) => void;
export type DrawFrameRef = MutableRefObject<DrawFrame | undefined>;
export type AnimationSubscription = { stop: () => void };

export const startAnimation = (draw: DrawFrameRef): AnimationSubscription => {
	let next = true;
	let time = 0;
	const loop = (curTime: number) => {
		if (draw.current) draw.current(curTime - time);
		time = curTime;
		next && requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
	return { stop: () => { next = false; } };
};
