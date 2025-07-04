import { ComplexArray } from './complexArray';

export type Fourier = {
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
) => Promise<Fourier>;

export type CreateGpuFourierOptions = {
  windowSize: number;
  windowCount: number;
  device: GPUDevice;
};
export type CreateGpuFourier = (
  options: CreateGpuFourierOptions,
) => Promise<Fourier>;
