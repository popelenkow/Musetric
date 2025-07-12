import { ComplexArray } from '../../common';

export const normalizeMagnitude = (
  input: ComplexArray,
  output: Float32Array,
): void => {
  for (let i = 0; i < output.length; i++) {
    const real = input.real[i];
    const imag = input.imag[i];
    output[i] = Math.hypot(real, imag);
  }
};
