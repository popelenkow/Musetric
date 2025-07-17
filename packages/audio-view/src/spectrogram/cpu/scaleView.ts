import { Parameters } from '../parameters';

export const scaleView = (
  windowSize: number,
  height: number,
  parameters: Parameters,
  magnitude: Float32Array,
  column: Uint8Array,
) => {
  const { sampleRate, maxFrequency, minFrequency } = parameters;
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

  for (let y = 0; y < height; y++) {
    const ratio = 1 - y / (height - 1);
    const raw = Math.exp(logMin + logRange * ratio);
    const idx = Math.max(minBin, Math.min(Math.floor(raw) - 1, maxBin - 1));
    column[y] = Math.round(magnitude[idx] * 255);
  }
};
