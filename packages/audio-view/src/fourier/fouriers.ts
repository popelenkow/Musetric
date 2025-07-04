import { createCpuFftRadix4 } from './cpuFftRadix4';
import { createGpuDft } from './gpuDft';
import { createGpuFftRadix2 } from './gpuFftRadix2';
import { createGpuFftRadix4 } from './gpuFftRadix4';

export const cpuFouriers = {
  cpuFftRadix4: createCpuFftRadix4,
} as const;

export const gpuFouriers = {
  gpuDft: createGpuDft,
  gpuFftRadix2: createGpuFftRadix2,
  gpuFftRadix4: createGpuFftRadix4,
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
