import { CpuMarker } from '../../common';

export const sliceWaves = (
  windowSize: number,
  windowCount: number,
  visibleTimeBefore: number,
  visibleTimeAfter: number,
  sampleRate: number,
  wave: Float32Array,
  waves: Float32Array,
  progress: number,
): void => {
  const beforeSamples = visibleTimeBefore * sampleRate + windowSize;
  const afterSamples = visibleTimeAfter * sampleRate;
  const visibleSamples = beforeSamples + afterSamples;

  const startOffset = progress * wave.length - beforeSamples;
  const step = (visibleSamples - windowSize) / (windowCount - 1);

  for (let i = 0; i < windowCount; i++) {
    const windowOffset = i * windowSize;
    const start = Math.floor(startOffset + i * step);
    const end = start + windowSize;
    if (start >= 0 && end < wave.length) {
      const slice = wave.subarray(start, end);
      waves.set(slice, windowOffset);
      continue;
    }
    for (let j = 0; j < windowSize; j++) {
      const index = start + j;
      const value = index >= 0 && index < wave.length ? wave[index] : 0;
      waves[windowOffset + j] = value;
    }
  }
};

export type SliceWaves = {
  run: (wave: Float32Array, waves: Float32Array, progress: number) => void;
  configure: (
    windowSize: number,
    windowCount: number,
    visibleTimeBefore: number,
    visibleTimeAfter: number,
    sampleRate: number,
  ) => void;
};
export const createSliceWaves = (marker?: CpuMarker): SliceWaves => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowSize: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowCount: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let visibleTimeBefore: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let visibleTimeAfter: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let sampleRate: number = undefined!;

  const ref: SliceWaves = {
    run: (wave, waves, progress) => {
      sliceWaves(
        windowSize,
        windowCount,
        visibleTimeBefore,
        visibleTimeAfter,
        sampleRate,
        wave,
        waves,
        progress,
      );
    },
    configure: (
      newWindowSize,
      newWindowCount,
      newVisibleTimeBefore,
      newVisibleTimeAfter,
      newSampleRate,
    ) => {
      windowSize = newWindowSize;
      windowCount = newWindowCount;
      visibleTimeBefore = newVisibleTimeBefore;
      visibleTimeAfter = newVisibleTimeAfter;
      sampleRate = newSampleRate;
    },
  };
  ref.run = marker?.(ref.run) ?? ref.run;
  return ref;
};
