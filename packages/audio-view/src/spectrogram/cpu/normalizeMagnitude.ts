import { ComplexArray } from '../../common';

export const normalizeMagnitude = (
  windowSize: number,
  windowCount: number,
  waves: ComplexArray,
  magnitude: Float32Array,
): void => {
  const halfSize = windowSize / 2;

  for (let windowIndex = 0; windowIndex < windowCount; windowIndex++) {
    const windowOffset = windowIndex * windowSize;
    for (let i = 0; i < halfSize; i++) {
      const real = waves.real[windowOffset + i];
      const imag = waves.imag[windowOffset + i];
      magnitude[windowOffset / 2 + i] = Math.hypot(real, imag);
    }
  }
};
