import { CpuMarker } from '../../common';
import { ExtPipelineConfig } from '../pipeline';

type Config = Pick<
  ExtPipelineConfig,
  'windowSize' | 'windowCount' | 'zeroPaddingFactor' | 'minDecibel'
>;

export const decibelify = (config: Config, magnitudes: Float32Array): void => {
  const { windowSize, windowCount, zeroPaddingFactor, minDecibel } = config;
  const paddedWindowSize = windowSize * zeroPaddingFactor;
  const halfSize = paddedWindowSize / 2;

  const epsilon = 1e-12;
  const decibelFactor = (20 * Math.LOG10E) / -minDecibel;

  for (let windowIndex = 0; windowIndex < windowCount; windowIndex++) {
    const windowOffset = windowIndex * halfSize;
    let maxMagnitude = 0;
    for (let i = 0; i < halfSize; i++) {
      const amplitude = magnitudes[windowOffset + i];
      if (amplitude > maxMagnitude) maxMagnitude = amplitude;
    }

    const inverseMax = 1 / maxMagnitude;
    for (let i = 0; i < halfSize; i++) {
      const idx = windowOffset + i;
      const magnitude = magnitudes[idx] * inverseMax + epsilon;
      const decibel = Math.log(magnitude) * decibelFactor + 1;
      magnitudes[idx] = decibel > 0 ? decibel : 0;
    }
  }
};

export type Decibelify = {
  run: (magnitudes: Float32Array) => void;
  configure: (config: Config) => void;
};
export const createDecibelify = (marker?: CpuMarker): Decibelify => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let config: Config;

  const ref: Decibelify = {
    run: (magnitudes) => decibelify(config, magnitudes),
    configure: (newConfig) => {
      config = newConfig;
    },
  };
  ref.run = marker?.(ref.run) ?? ref.run;
  return ref;
};
