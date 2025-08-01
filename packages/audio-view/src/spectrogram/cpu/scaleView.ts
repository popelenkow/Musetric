import { CpuMarker } from '../../common';
import { ExtPipelineConfig } from '../pipeline';

type Config = Pick<
  ExtPipelineConfig,
  | 'windowSize'
  | 'sampleRate'
  | 'zeroPaddingFactor'
  | 'minFrequency'
  | 'maxFrequency'
  | 'viewSize'
>;

export const scaleView = (
  config: Config,
  magnitudes: Float32Array,
  view: Uint8Array,
) => {
  const {
    windowSize,
    sampleRate,
    zeroPaddingFactor,
    minFrequency,
    maxFrequency,
    viewSize,
  } = config;
  const { width, height } = viewSize;
  const paddedWindowSize = windowSize * zeroPaddingFactor;

  const halfSize = paddedWindowSize / 2;
  const maxBin = Math.min(
    Math.floor((maxFrequency / sampleRate) * paddedWindowSize),
    halfSize,
  );
  const minBin = Math.max(
    Math.floor((minFrequency / sampleRate) * paddedWindowSize),
    0,
  );
  const logMin = Math.log(minBin + 1);
  const logRange = Math.log(maxBin + 1) - logMin;

  for (let x = 0; x < width; x++) {
    const windowOffset = x * halfSize;
    const columnOffset = x * height;
    for (let y = 0; y < height; y++) {
      const ratio = 1 - y / (height - 1);
      const raw = Math.exp(logMin + logRange * ratio);
      const idx = Math.max(minBin, Math.min(Math.floor(raw) - 1, maxBin - 1));
      const magnitude = magnitudes[windowOffset + idx];
      view[columnOffset + y] = Math.round(magnitude * 255);
    }
  }
};

export type ScaleView = {
  run: (magnitudes: Float32Array, view: Uint8Array) => void;
  configure: (config: Config) => void;
};
export const createScaleView = (marker?: CpuMarker): ScaleView => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let config: Config;

  const ref: ScaleView = {
    run: (magnitudes, view) => scaleView(config, magnitudes, view),
    configure: (newConfig) => {
      config = newConfig;
    },
  };
  ref.run = marker?.(ref.run) ?? ref.run;
  return ref;
};
