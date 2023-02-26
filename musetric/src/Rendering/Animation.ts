export type AnimationCallback = (delta: number) => void;
export type StopAnimation = () => void;

export const startAnimation = (callback: AnimationCallback): StopAnimation => {
	let next = true;
	let time = 0;
	const loop = (curTime: number): void => {
		if (!next) return;
		callback(curTime - time);
		time = curTime;
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
	return () => {
		next = false;
	};
};
