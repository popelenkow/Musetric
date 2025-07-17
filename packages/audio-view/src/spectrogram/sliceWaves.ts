import { ComplexArray } from '../common';

export type SliceWavesOptions = {
  windowSize: number;
  windowCount: number;
  wave: Float32Array;
  waves: ComplexArray;
};
export const sliceWaves = (options: SliceWavesOptions): void => {
  const { windowSize, windowCount, wave, waves } = options;

  const step = (wave.length - windowSize) / windowCount;

  for (let i = 0; i < windowCount; i++) {
    const offset = i * windowSize;
    const start = Math.floor(i * step);
    const slice = wave.subarray(start, start + windowSize);
    waves.real.set(slice, offset);
    waves.imag.fill(0, offset, offset + windowSize);
  }
};
