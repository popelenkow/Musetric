export const skipPromise = (promise: Promise<unknown>) => {
	promise.finally(() => {});
};
