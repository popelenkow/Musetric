import { ComplexArray } from '../common';

export type CpuFourier = {
  forward: (input: ComplexArray, output: ComplexArray) => Promise<void>;
  inverse: (input: ComplexArray, output: ComplexArray) => Promise<void>;
  resize: (windowCount: number) => void;
  destroy: () => void;
};

export type CreateCpuFourierOptions = {
  windowSize: number;
};
export type CreateCpuFourier = (
  options: CreateCpuFourierOptions,
) => Promise<CpuFourier>;
