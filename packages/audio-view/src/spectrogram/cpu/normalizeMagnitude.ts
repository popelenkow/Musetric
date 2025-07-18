import { ComplexArray } from '../../common';

export const normalizeMagnitude = (
  windowSize: number,
  windowCount: number,
  signal: ComplexArray,
): void => {
  const halfSize = windowSize / 2;

  for (let windowIndex = 0; windowIndex < windowCount; windowIndex++) {
    const windowOffset = windowIndex * windowSize;
    const halfOffset = windowIndex * halfSize;
    for (let i = 0; i < halfSize; i++) {
      const real = signal.real[windowOffset + i];
      const imag = signal.imag[windowOffset + i];
      signal.real[halfOffset + i] = Math.hypot(real, imag);
    }
  }
};
