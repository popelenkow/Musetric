import { CpuMarker } from '../../common';
import { ExtPipelineConfig } from '../pipeline';
import { windowFilters } from '../windowFilters';

type Config = Pick<
  ExtPipelineConfig,
  'windowSize' | 'windowCount' | 'zeroPaddingFactor' | 'windowFilter'
>;

export type FilterWave = {
  run: (signal: Float32Array) => void;
  configure: (config: Config) => void;
};

export const createFilterWave = (marker?: CpuMarker): FilterWave => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let config: Config;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let windowFilter: Float32Array;

  const ref: FilterWave = {
    run: (signal) => {
      const { windowSize, windowCount, zeroPaddingFactor } = config;
      const paddedWindowSize = windowSize * zeroPaddingFactor;
      for (let windowIndex = 0; windowIndex < windowCount; windowIndex++) {
        const windowOffset = paddedWindowSize * windowIndex;
        for (let i = 0; i < windowSize; i++) {
          signal[windowOffset + i] *= windowFilter[i];
        }
      }
    },
    configure: (newConfig) => {
      config = newConfig;
      windowFilter = windowFilters[config.windowFilter](config.windowSize);
    },
  };
  ref.run = marker?.(ref.run) ?? ref.run;
  return ref;
};
