import type { ComplexArray } from '../../fourier';
import { Parameters } from '../parameters';

export const fillWave = (
  windowSize: number,
  windowCount: number,
  input: Float32Array,
  wave: ComplexArray,
): void => {
  const step = (input.length - windowSize) / windowCount;

  for (let i = 0; i < windowCount; i++) {
    const offset = i * windowSize;
    const start = Math.floor(i * step);
    const slice = input.subarray(start, start + windowSize);
    wave.real.set(slice, offset);
    wave.imag.fill(0, offset, offset + windowSize);
  }
};

export const computeColumn = (
  windowSize: number,
  height: number,
  parameters: Parameters,
  magnitude: Float32Array,
  column: Uint8Array,
) => {
  const { maxFrequency, sampleRate, minFrequency } = parameters;
  const fullBins = windowSize / 2;
  const maxBin = Math.min(
    Math.floor((maxFrequency / sampleRate) * windowSize),
    fullBins,
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
