export type DrawFrame = (delta: number) => void;
export type AnimationSubscription = { stop: () => void };

export const startAnimation = (getDraw: () => DrawFrame | undefined): AnimationSubscription => {
	let next = true;
	let time = 0;
	const loop = (curTime: number) => {
		const draw = getDraw();
		if (draw) draw(curTime - time);
		time = curTime;
		next && requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
	return { stop: () => { next = false; } };
};
