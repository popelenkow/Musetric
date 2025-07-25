import { hammingWindowFilter } from '../windowFilters';

export type FilterWave = {
  run: (signal: Float32Array) => void;
  configure: (windowSize: number, windowCount: number) => void;
};

export const createFilterWave = (): FilterWave => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowSize: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowCount: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowFilter: Float32Array = undefined!;

  const state: FilterWave = {
    run: (signal) => {
      for (let windowIndex = 0; windowIndex < windowCount; windowIndex++) {
        const windowOffset = windowSize * windowIndex;
        for (let i = 0; i < windowSize; i++) {
          signal[windowOffset + i] *= windowFilter[i];
        }
      }
    },
    configure: (newWindowSize, newWindowCount) => {
      windowSize = newWindowSize;
      windowCount = newWindowCount;
      windowFilter = hammingWindowFilter(windowSize);
    },
  };

  return state;
};
