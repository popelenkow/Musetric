import { ComplexArray } from '../complexArray';
import { CreateCpuFourier } from '../fourier';
import { assertWindowSizePowerOfTwo } from '../isPowerOfTwo';
import { utilsRadix4 } from '../utilsRadix4';
import { transform4 } from './utils';

export const createCpuFftRadix4: CreateCpuFourier = async (options) => {
  const { windowSize } = options;
  assertWindowSizePowerOfTwo(windowSize);

  const reverseWidth = utilsRadix4.getReverseWidth(windowSize);
  const reverseTable = utilsRadix4.createReverseTable(reverseWidth);
  const trigTable = utilsRadix4.createTrigTable(windowSize);

  const transform = async (
    input: ComplexArray,
    output: ComplexArray,
    inverse: boolean,
  ) => {
    const windowCount = input.real.length / windowSize;
    for (let i = 0; i < windowCount; i++) {
      const inputSlice: ComplexArray = {
        real: input.real.subarray(i * windowSize, (i + 1) * windowSize),
        imag: input.imag.subarray(i * windowSize, (i + 1) * windowSize),
      };
      const outputSlice: ComplexArray = {
        real: output.real.subarray(i * windowSize, (i + 1) * windowSize),
        imag: output.imag.subarray(i * windowSize, (i + 1) * windowSize),
      };
      transform4({
        input: inputSlice,
        output: outputSlice,
        inverse,
        windowSize,
        reverseWidth: reverseWidth,
        reverseTable,
        trigTable,
      });
      if (inverse) {
        for (let j = 0; j < windowSize; j++) {
          outputSlice.real[j] /= windowSize;
          outputSlice.imag[j] /= windowSize;
        }
      }
    }
  };

  return {
    forward: async (input: ComplexArray, output: ComplexArray) => {
      await transform(input, output, false);
    },
    inverse: async (input: ComplexArray, output: ComplexArray) => {
      await transform(input, output, true);
    },
    resize: () => {
      // CPU implementation does not allocate persistent buffers
    },
    destroy: () => {
      // CPU implementation does not allocate persistent buffers
    },
  };
};
