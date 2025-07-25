import { ComplexGpuBuffer } from '../common';

export type GpuFourierParams = {
  windowSize: number;
  windowCount: number;
};

export type GpuFourier = {
  forward: (encoder: GPUCommandEncoder) => void;
  configure: (signal: ComplexGpuBuffer, params: GpuFourierParams) => void;
  destroy: () => void;
};

export type FourierTimestampWrites = {
  reverse?: GPUComputePassTimestampWrites;
  transform?: GPUComputePassTimestampWrites;
};

export type CreateGpuFourier = (
  device: GPUDevice,
  markers?: FourierTimestampWrites,
) => GpuFourier;
