export type AnimationSubscription = { stop: () => void };

export const startAnimation = (draw: (delta: number) => void): AnimationSubscription => {
	let id: number;
	let time = 0;
	const loop = (curTime: number) => {
		draw(curTime - time);
		time = curTime;
		id = requestAnimationFrame(loop);
	};
	id = requestAnimationFrame(loop);
	return { stop: () => cancelAnimationFrame(id) };
};
