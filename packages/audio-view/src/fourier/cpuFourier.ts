import { ComplexArray, CpuMarker } from '../common';
import { FourierConfig } from './config';

export type CpuFourier = {
  forward: (signal: ComplexArray) => void;
  inverse: (signal: ComplexArray) => void;
  configure: (config: FourierConfig) => void;
};

export type CreateCpuFourier = (marker?: CpuMarker) => CpuFourier;
