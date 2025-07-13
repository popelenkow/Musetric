import { useEffect, useRef, useState } from 'react';

type Unmount<T> = (state: T) => Promise<void> | void;

export type UseAsyncResourceOptions<T> = {
  create: () => Promise<T | undefined> | T | undefined;
  unmount?: Unmount<T>;
  deps: unknown[];
};
export const useAsyncResource = <T>(options: UseAsyncResourceOptions<T>) => {
  type RefValue = {
    state?: T;
    unmount?: Unmount<T>;
  };
  const ref = useRef<RefValue>({});
  ref.current.unmount = options.unmount;

  const [, rerender] = useState(() => ({}));

  useEffect(() => {
    let unmounted = false;

    const runAsync = async () => {
      const newState = await options.create();
      if (unmounted) {
        if (newState) {
          await options.unmount?.(newState);
        }
        return;
      }
      const oldState = ref.current.state;
      ref.current.state = newState;
      rerender({});
      if (oldState) {
        await options.unmount?.(oldState);
      }
    };

    void runAsync();

    return () => {
      unmounted = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, options.deps);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const { state, unmount } = ref.current;
      if (!state) return;
      void unmount?.(state);
    };
  }, []);

  return ref.current.state;
};
