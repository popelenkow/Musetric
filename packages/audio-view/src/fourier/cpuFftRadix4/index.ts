import { ComplexArray, subComplexArray } from '../../common';
import { CreateCpuFourier } from '../cpuFourier';
import { assertWindowSizePowerOfTwo } from '../isPowerOfTwo';
import { utilsRadix4 } from '../utilsRadix4';
import { transform4 } from './utils';

export const createCpuFftRadix4: CreateCpuFourier = (options) => {
  const { windowSize } = options;
  assertWindowSizePowerOfTwo(windowSize);

  const reverseWidth = utilsRadix4.getReverseWidth(windowSize);
  const reverseTable = utilsRadix4.createReverseTable(reverseWidth);
  const trigTable = utilsRadix4.createTrigTable(windowSize);

  const transform = (
    signal: ComplexArray,
    windowCount: number,
    inverse: boolean,
  ) => {
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
  };
};
