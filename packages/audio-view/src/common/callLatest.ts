type AsyncFunction<Args extends unknown[], Result> = (
  ...args: Args
) => Promise<Result>;

const createCallLatestInternal = <Args extends unknown[], Result>(
  asyncFunction: AsyncFunction<Args, Result>,
): AsyncFunction<Args, Result> => {
  type PromiseResult = Promise<Result>;
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  let currentPromise = Promise.resolve() as PromiseResult;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let latestFunction: () => PromiseResult = undefined!;

  const call: AsyncFunction<Args, Result> = (...args) => {
    latestFunction = () => {
      currentPromise = asyncFunction(...args);
      return currentPromise;
    };

    const promise = currentPromise;
    return currentPromise.finally(() => {
      if (promise !== currentPromise) {
        return currentPromise;
      }
      return latestFunction();
    });
  };

  return call;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CreateCallLatest = <Call extends AsyncFunction<any[], any>>(
  asyncFunction: Call,
) => Call;
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const createCallLatest = createCallLatestInternal as CreateCallLatest;
