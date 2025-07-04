import { ComplexArray } from '../../fourier';

export type PipelineBuffers = {
  frequency: ComplexArray;
  magnitude: Float32Array;
  wave: ComplexArray;
};
export const createPipelineBuffers = (
  windowSize: number,
  windowCount: number,
): PipelineBuffers => {
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
