export type LoopCallback = () => void;
export type StopLoop = () => void;

export const startLoop = (callback: LoopCallback, timeout?: number): StopLoop => {
	let next = true;
	const loop = (): void => {
		if (!next) return;
		callback();
		setTimeout(loop, timeout);
	};
	loop();
	return () => {
		next = false;
	};
};
