export const skipPromise = (promise: Promise<unknown>): void => {
	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	promise.then(() => {});
};
