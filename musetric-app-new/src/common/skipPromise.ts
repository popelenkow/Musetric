export const skipPromise = (promise: Promise<unknown>): void => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    promise.then(() => {});
};

export const depromisify = (callback: () => Promise<unknown>): (() => void) => (
    () => skipPromise(callback())
);
