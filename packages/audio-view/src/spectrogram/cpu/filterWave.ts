import { CpuMarker } from '../../common';
import { windowFilters, WindowFilterKey } from '../windowFilters';

export type FilterWave = {
  run: (signal: Float32Array) => void;
  configure: (
    windowSize: number,
    windowCount: number,
    windowFilterKey: WindowFilterKey,
    zeroPaddingFactor: number,
  ) => void;
};

export const createFilterWave = (marker?: CpuMarker): FilterWave => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowSize: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowCount: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowFilter: Float32Array = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let zeroPaddingFactor: number = undefined!;

  const ref: FilterWave = {
    run: (signal) => {
      const paddedWindowSize = windowSize * zeroPaddingFactor;
      for (let windowIndex = 0; windowIndex < windowCount; windowIndex++) {
        const windowOffset = paddedWindowSize * windowIndex;
        for (let i = 0; i < windowSize; i++) {
          signal[windowOffset + i] *= windowFilter[i];
        }
      }
    },
    configure: (
      newWindowSize,
      newWindowCount,
      windowFilterKey,
      newZeroPaddingFactor,
    ) => {
      windowSize = newWindowSize;
      windowCount = newWindowCount;
      windowFilter = windowFilters[windowFilterKey](windowSize);
      zeroPaddingFactor = newZeroPaddingFactor;
    },
  };
  ref.run = marker?.(ref.run) ?? ref.run;
  return ref;
};
