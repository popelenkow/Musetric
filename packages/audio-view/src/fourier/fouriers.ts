import { createDftGpu } from './dftGpu';
import { createFftRadix2Gpu } from './fftRadix2Gpu';
import { createFftRadix4Cpu } from './fftRadix4Cpu';
import { createFftRadix4Gpu } from './fftRadix4Gpu';

export const fouriers = {
  dftGpu: createDftGpu,
  fftRadix2Gpu: createFftRadix2Gpu,
  fftRadix4Cpu: createFftRadix4Cpu,
  fftRadix4Gpu: createFftRadix4Gpu,
} as const;

export type FourierMode = keyof typeof fouriers;
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const fourierModes = Object.keys(fouriers) as FourierMode[];
