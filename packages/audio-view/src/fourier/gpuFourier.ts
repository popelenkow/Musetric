import { ComplexArray, ComplexGpuBuffer } from '../common';

export type GpuFourier = {
  forward: (input: ComplexArray) => Promise<ComplexGpuBuffer>;
  inverse: (input: ComplexArray) => Promise<ComplexGpuBuffer>;
  resize: (windowCount: number) => void;
  destroy: () => void;
};

export type CreateGpuFourierOptions = {
  windowSize: number;
  windowCount: number;
  device: GPUDevice;
};

export type CreateGpuFourier = (
  options: CreateGpuFourierOptions,
) => Promise<GpuFourier>;
