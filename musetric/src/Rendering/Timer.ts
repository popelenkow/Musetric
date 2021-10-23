export type Timer = {
	timeIsUp: () => boolean;
};
export const createTimer = (ms: number): Timer => {
	const startAt = new Date().getTime();
	let isEnded = false;
	return {
		timeIsUp: () => {
			if (isEnded) return true;
			const elapsed = new Date().getTime() - startAt;
			isEnded = elapsed > ms;
			return isEnded;
		},
	};
};
