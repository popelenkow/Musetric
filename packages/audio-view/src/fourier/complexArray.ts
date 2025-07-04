export type ComplexArray = {
  real: Float32Array;
  imag: Float32Array;
};

export const normComplexArray = (
  input: ComplexArray,
  output: Float32Array,
): void => {
  for (let i = 0; i < output.length; i++) {
    const real = input.real[i];
    const imag = input.imag[i];
    output[i] = Math.hypot(real, imag);
  }
};
