import { ComplexArray, subComplexArray } from '../../common';
import { CreateCpuFourier } from '../cpuFourier';
import { createState } from './state';
import { transform4 } from './utils';

export const createCpuFftRadix4: CreateCpuFourier = () => {
  const state = createState();

  const transform = (signal: ComplexArray, inverse: boolean) => {
    const { windowSize, windowCount, reverseWidth, reverseTable, trigTable } =
      state;
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
    forward: (signal) => {
      transform(signal, false);
    },
    inverse: (signal) => {
      transform(signal, true);
    },
    configure: state.configure,
  };
};
