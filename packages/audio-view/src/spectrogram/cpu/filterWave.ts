import { hammingWindowFilter } from '../windowFilters';

export const createFilterWave = (windowSize: number) => {
  const windowFilter = hammingWindowFilter(windowSize);

  const run = (windowCount: number, signal: Float32Array): void => {
    for (let windowIndex = 0; windowIndex < windowCount; windowIndex++) {
      const windowOffset = windowSize * windowIndex;
      for (let i = 0; i < windowSize; i++) {
        signal[windowOffset + i] *= windowFilter[i];
      }
    }
  };
  return run;
};
