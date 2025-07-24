import { ComplexArray, subComplexArray } from '../../common';
import { CreateCpuFourier } from '../cpuFourier';
import { createState } from './state';
import { transform4 } from './utils';

export const createCpuFftRadix4: CreateCpuFourier = () => {
  const state = createState();

  const transform = (
    signal: ComplexArray,
    windowCount: number,
    inverse: boolean,
  ) => {
    const { windowSize, reverseWidth, reverseTable, trigTable } = state;
    for (let i = 0; i < windowCount; i++) {
      const start = i * windowSize;
      const end = start + windowSize;
      const slice = subComplexArray(signal, start, end);
      transform4({
        signal: slice,
        inverse,
        windowSize,
        reverseWidth,
        reverseTable,
        trigTable,
      });
      if (inverse) {
        for (let j = 0; j < windowSize; j++) {
          slice.real[j] /= windowSize;
          slice.imag[j] /= windowSize;
        }
      }
    }
  };

  return {
    forward: (signal, windowCount) => {
      transform(signal, windowCount, false);
    },
    inverse: (signal, windowCount) => {
      transform(signal, windowCount, true);
    },
    configure: (windowSize) => {
      state.configure(windowSize);
    },
  };
};
