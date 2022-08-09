export const skipPromise = (promise: Promise<unknown>): void => {
	promise.finally(() => {});
};
