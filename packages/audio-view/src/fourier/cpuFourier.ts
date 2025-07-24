import { ComplexArray } from '../common';

export type CpuFourier = {
  forward: (signal: ComplexArray, windowCount: number) => void;
  inverse: (signal: ComplexArray, windowCount: number) => void;
  configure: (windowSize: number) => void;
};

export type CreateCpuFourier = () => CpuFourier;
