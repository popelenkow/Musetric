import { ComplexArray } from './complexArray';

export type Fourier = {
  forward: (input: ComplexArray, output: ComplexArray) => Promise<void>;
  inverse: (input: ComplexArray, output: ComplexArray) => Promise<void>;
};
