import { ComplexArray } from '../../fourier';

export const createPipelineBuffers = (
  windowSize: number,
  windowCount: number,
) => {
  const windowLength = windowSize * windowCount;
  const frequency: ComplexArray = {
    real: new Float32Array(windowLength),
    imag: new Float32Array(windowLength),
  };
  const magnitude = new Float32Array(windowSize / 2);
  const wave: ComplexArray = {
    real: new Float32Array(windowLength),
    imag: new Float32Array(windowLength),
  };

  return { frequency, magnitude, wave };
};
