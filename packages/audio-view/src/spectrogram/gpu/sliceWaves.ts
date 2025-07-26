import { ComplexArray, CpuMarker } from '../../common';
import { sliceWaves } from '../cpu';

export type SliceWaves = {
  run: (wave: Float32Array, waves: ComplexArray) => void;
  configure: (windowSize: number, windowCount: number) => void;
};
export const createSliceWaves = (marker?: CpuMarker): SliceWaves => {
  let windowSize = 0;
  let windowCount = 0;

  const ref: SliceWaves = {
    run: (wave, waves) => {
      sliceWaves(windowSize, windowCount, wave, waves);
    },
    configure: (newWindowSize, newWindowCount): void => {
      windowSize = newWindowSize;
      windowCount = newWindowCount;
    },
  };
  ref.run = marker?.(ref.run) ?? ref.run;
  return ref;
};
