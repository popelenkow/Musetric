import { hammingWindowFilter } from '../windowFilters';

export type FilterWave = {
  run: (windowCount: number, signal: Float32Array) => void;
  configure: (windowSize: number) => void;
};

export const createFilterWave = (): FilterWave => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowSize: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowFilter: Float32Array = undefined!;

  const state: FilterWave = {
    run: (windowCount, signal) => {
      for (let windowIndex = 0; windowIndex < windowCount; windowIndex++) {
        const windowOffset = windowSize * windowIndex;
        for (let i = 0; i < windowSize; i++) {
          signal[windowOffset + i] *= windowFilter[i];
        }
      }
    },
    configure: (newWindowSize) => {
      windowSize = newWindowSize;
      windowFilter = hammingWindowFilter(windowSize);
    },
  };

  return state;
};
