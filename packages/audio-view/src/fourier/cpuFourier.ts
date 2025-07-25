import { ComplexArray } from '../common';

export type CpuFourier = {
  forward: (signal: ComplexArray) => void;
  inverse: (signal: ComplexArray) => void;
  configure: (windowSize: number, windowCount: number) => void;
};

export type CreateCpuFourier = () => CpuFourier;
