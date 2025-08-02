import { CpuMarker } from '../../common';
import { ExtPipelineConfig } from '../pipeline';

type Config = Pick<
  ExtPipelineConfig,
  | 'windowSize'
  | 'windowCount'
  | 'sampleRate'
  | 'visibleTimeBefore'
  | 'visibleTimeAfter'
  | 'zeroPaddingFactor'
>;

export const sliceWaves = (
  config: Config,
  wave: Float32Array,
  waves: Float32Array,
  progress: number,
): void => {
  const {
    windowSize,
    windowCount,
    sampleRate,
    visibleTimeBefore,
    visibleTimeAfter,
    zeroPaddingFactor,
  } = config;
  const paddedWindowSize = windowSize * zeroPaddingFactor;

  const beforeSamples = visibleTimeBefore * sampleRate + windowSize;
  const afterSamples = visibleTimeAfter * sampleRate;
  const visibleSamples = beforeSamples + afterSamples;

  const startOffset = progress * wave.length - beforeSamples;
  const step = (visibleSamples - windowSize) / (windowCount - 1);

  for (let i = 0; i < windowCount; i++) {
    const windowOffset = i * paddedWindowSize;
    const start = Math.floor(startOffset + i * step);
    const end = start + windowSize;

    waves.fill(0, windowOffset + windowSize, windowOffset + paddedWindowSize);
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
  configure: (config: Config) => void;
};
export const createSliceWaves = (marker?: CpuMarker): SliceWaves => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let config: Config;

  const ref: SliceWaves = {
    run: (wave, waves, progress) => {
      sliceWaves(config, wave, waves, progress);
    },
    configure: (newConfig) => {
      config = newConfig;
    },
  };
  ref.run = marker?.(ref.run) ?? ref.run;
  return ref;
};
