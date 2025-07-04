import { createDftGpu } from './dftGpu';
import { createFftRadix2Gpu } from './fftRadix2Gpu';
import { createFftRadix4Cpu } from './fftRadix4Cpu';
import { createFftRadix4Gpu } from './fftRadix4Gpu';

export const cpuFouriers = {
  fftRadix4Cpu: createFftRadix4Cpu,
} as const;

export const gpuFouriers = {
  dftGpu: createDftGpu,
  fftRadix2Gpu: createFftRadix2Gpu,
  fftRadix4Gpu: createFftRadix4Gpu,
} as const;

export const fouriers = {
  ...cpuFouriers,
  ...gpuFouriers,
} as const;

export type CpuFourierMode = keyof typeof cpuFouriers;
export type GpuFourierMode = keyof typeof gpuFouriers;
export type FourierMode = keyof typeof fouriers;
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const fourierModes = Object.keys(fouriers) as FourierMode[];

export const isGpuFourierMode = (mode: FourierMode): mode is GpuFourierMode => {
  return mode in gpuFouriers;
};
