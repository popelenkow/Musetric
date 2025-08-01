import { ComplexArray, CpuMarker, subComplexArray } from '../../common';
import { CpuFourier, CreateCpuFourier } from '../cpuFourier';
import { createState } from './state';
import { transform4 } from './utils';

export const createCpuFftRadix4: CreateCpuFourier = (marker?: CpuMarker) => {
  const state = createState();

  const transform = (signal: ComplexArray, inverse: boolean) => {
    const { config, reverseWidth, reverseTable, trigTable } = state;
    const { windowSize, windowCount } = config;
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

  const ref: CpuFourier = {
    forward: (signal) => {
      transform(signal, false);
    },
    inverse: (signal) => {
      transform(signal, true);
    },
    configure: state.configure,
  };
  ref.forward = marker?.(ref.forward) ?? ref.forward;
  ref.inverse = marker?.(ref.inverse) ?? ref.inverse;
  return ref;
};
