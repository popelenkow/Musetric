export type AnimationCallback = (delta: number) => void;
export type StopAnimation = () => void;

export const startAnimation = (callback: AnimationCallback): StopAnimation => {
	let next = true;
	let time = 0;
	const loop = (curTime: number) => {
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

export type AnimationState = {
	onIteration: () => void;
	onStop?: () => void;
	onStopped?: () => void;
};
export type OnStart<T extends unknown[]> = (...args: T) => AnimationState;
export type Animation<T extends unknown[]> = {
	start: (...args: T) => void;
	stop: () => void;
};
export const createAnimation = <T extends unknown[]>(onStart: OnStart<T>): Animation<T> => {
	type State = Omit<AnimationState, 'onIteration'> & {
		stopAnimation: StopAnimation;
	};
	let state: State | undefined;
	const stop = () => {
		if (!state) return;
		const { stopAnimation, onStop, onStopped } = state;
		state = undefined;
		if (onStop) onStop();
		stopAnimation();
		if (onStopped) onStopped();
	};
	const start = (...args: T) => {
		stop();
		const { onIteration, onStop, onStopped } = onStart(...args);
		const stopAnimation = startAnimation(onIteration);
		state = { stopAnimation, onStop, onStopped };
	};
	return { start, stop };
};
