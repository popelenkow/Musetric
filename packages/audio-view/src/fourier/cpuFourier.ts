import { ComplexArray, CpuMarker } from '../common';

export type CpuFourier = {
  forward: (signal: ComplexArray) => void;
  inverse: (signal: ComplexArray) => void;
  configure: (windowSize: number, windowCount: number) => void;
};

export type CreateCpuFourier = (marker?: CpuMarker) => CpuFourier;
