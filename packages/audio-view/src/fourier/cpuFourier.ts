import { ComplexArray } from '../common';

export type CpuFourier = {
  forward: (signal: ComplexArray, windowCount: number) => void;
  inverse: (signal: ComplexArray, windowCount: number) => void;
};

export type CreateCpuFourierOptions = {
  windowSize: number;
};
export type CreateCpuFourier = (options: CreateCpuFourierOptions) => CpuFourier;
