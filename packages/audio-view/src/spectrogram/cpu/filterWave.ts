import { CpuMarker } from '../../common';
import { windowFilters, WindowFilterKey } from '../windowFilters';

export type FilterWave = {
  run: (signal: Float32Array) => void;
  configure: (
    windowSize: number,
    windowCount: number,
    windowFilterKey: WindowFilterKey,
  ) => void;
};

export const createFilterWave = (marker?: CpuMarker): FilterWave => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowSize: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowCount: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowFilter: Float32Array = undefined!;

  const ref: FilterWave = {
    run: (signal) => {
      for (let windowIndex = 0; windowIndex < windowCount; windowIndex++) {
        const windowOffset = windowSize * windowIndex;
        for (let i = 0; i < windowSize; i++) {
          signal[windowOffset + i] *= windowFilter[i];
        }
      }
    },
    configure: (newWindowSize, newWindowCount, windowFilterKey) => {
      windowSize = newWindowSize;
      windowCount = newWindowCount;
      windowFilter = windowFilters[windowFilterKey](windowSize);
    },
  };
  ref.run = marker?.(ref.run) ?? ref.run;
  return ref;
};
