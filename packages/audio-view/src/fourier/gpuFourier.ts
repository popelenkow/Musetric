import { ComplexArray, ComplexGpuBuffer } from '../common';

export type GpuFourier = {
  forward: (
    encoder: GPUCommandEncoder,
    input: ComplexArray,
  ) => ComplexGpuBuffer;
  inverse: (
    encoder: GPUCommandEncoder,
    input: ComplexArray,
  ) => ComplexGpuBuffer;
  resize: (windowCount: number) => void;
  destroy: () => void;
};

export type CreateGpuFourierOptions = {
  device: GPUDevice;
  windowSize: number;
  windowCount: number;
};

export type CreateGpuFourier = (
  options: CreateGpuFourierOptions,
) => Promise<GpuFourier>;
