import { ComplexGpuBuffer } from '../common';
import { FourierConfig } from './config';

export type GpuFourier = {
  forward: (encoder: GPUCommandEncoder) => void;
  configure: (signal: ComplexGpuBuffer, config: FourierConfig) => void;
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
