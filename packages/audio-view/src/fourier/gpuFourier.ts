import { ComplexGpuBuffer } from '../common';

export type GpuFourierParams = {
  windowSize: number;
  windowCount: number;
};

export type GpuFourier = {
  forward: (encoder: GPUCommandEncoder, data: ComplexGpuBuffer) => void;
  writeParams: (params: GpuFourierParams) => void;
  destroy: () => void;
};

export type FourierTimestampWrites = {
  reverse?: GPUComputePassTimestampWrites;
  transform?: GPUComputePassTimestampWrites;
};

export type CreateGpuFourierOptions = {
  device: GPUDevice;
  windowSize: number;
  timestampWrites?: FourierTimestampWrites;
};

export type CreateGpuFourier = (
  options: CreateGpuFourierOptions,
) => Promise<GpuFourier>;
