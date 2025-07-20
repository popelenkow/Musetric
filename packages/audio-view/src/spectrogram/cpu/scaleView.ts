import { SignalViewParams } from '../signalViewParams';

export const scaleView = (
  windowSize: number,
  windowCount: number,
  height: number,
  viewParams: SignalViewParams,
  magnitudes: Float32Array,
  view: Uint8Array,
) => {
  const { sampleRate, maxFrequency, minFrequency } = viewParams;
  const halfSize = windowSize / 2;
  const maxBin = Math.min(
    Math.floor((maxFrequency / sampleRate) * windowSize),
    halfSize,
  );
  const minBin = Math.max(
    Math.floor((minFrequency / sampleRate) * windowSize),
    0,
  );
  const logMin = Math.log(minBin + 1);
  const logRange = Math.log(maxBin + 1) - logMin;

  for (let x = 0; x < windowCount; x++) {
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

export const createScaleView = () => scaleView;
