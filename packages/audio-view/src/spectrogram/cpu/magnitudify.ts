import { ComplexArray, CpuMarker } from '../../common';

export const magnitudify = (
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

export type Magnitudify = {
  run: (signal: ComplexArray) => void;
  configure: (windowSize: number, windowCount: number) => void;
};
export const createMagnitudify = (marker?: CpuMarker): Magnitudify => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowSize: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowCount: number = undefined!;

  const ref: Magnitudify = {
    run: (signal) => magnitudify(windowSize, windowCount, signal),
    configure: (newWindowSize, newWindowCount) => {
      windowSize = newWindowSize;
      windowCount = newWindowCount;
    },
  };
  ref.run = marker?.(ref.run) ?? ref.run;
  return ref;
};
