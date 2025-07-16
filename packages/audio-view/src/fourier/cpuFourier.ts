import { ComplexArray } from '../common';

export type CpuFourier = {
  forward: (input: ComplexArray, output: ComplexArray) => void;
  inverse: (input: ComplexArray, output: ComplexArray) => void;
};

export type CreateCpuFourierOptions = {
  windowSize: number;
};
export type CreateCpuFourier = (
  options: CreateCpuFourierOptions,
) => Promise<CpuFourier>;
