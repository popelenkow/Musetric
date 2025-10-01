import { ComplexArray, CpuMarker } from '../common/index.js';
import { FourierConfig } from './config.js';

export type CpuFourier = {
  forward: (signal: ComplexArray) => void;
  inverse: (signal: ComplexArray) => void;
  configure: (config: FourierConfig) => void;
};

export type CreateCpuFourier = (marker?: CpuMarker) => CpuFourier;
