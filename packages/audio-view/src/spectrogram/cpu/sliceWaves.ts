import { CpuMarker } from '../../common';

export const sliceWaves = (
  windowSize: number,
  windowCount: number,
  wave: Float32Array,
  waves: Float32Array,
): void => {
  const step = (wave.length - windowSize) / windowCount;

  for (let i = 0; i < windowCount; i++) {
    const offset = i * windowSize;
    const start = Math.floor(i * step);
    const slice = wave.subarray(start, start + windowSize);
    waves.set(slice, offset);
  }
};

export type SliceWaves = {
  run: (wave: Float32Array, waves: Float32Array) => void;
  configure: (windowSize: number, windowCount: number) => void;
};
export const createSliceWaves = (marker?: CpuMarker): SliceWaves => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowSize: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowCount: number = undefined!;

  const ref: SliceWaves = {
    run: (wave, waves) => {
      sliceWaves(windowSize, windowCount, wave, waves);
    },
    configure: (newWindowSize, newWindowCount) => {
      windowSize = newWindowSize;
      windowCount = newWindowCount;
    },
  };
  ref.run = marker?.(ref.run) ?? ref.run;
  return ref;
};
