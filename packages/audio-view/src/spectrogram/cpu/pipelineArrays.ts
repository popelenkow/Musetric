import { ComplexArray, createComplexArray } from '../../common';

export type PipelineArrays = {
  frequencies: ComplexArray;
  magnitudes: Float32Array;
  waves: ComplexArray;
};
export const createPipelineArrays = (
  windowSize: number,
  windowCount: number,
): PipelineArrays => {
  const windowLength = windowSize * windowCount;
  const frequencies = createComplexArray(windowLength);
  const magnitudes = new Float32Array(windowLength / 2);
  const waves = createComplexArray(windowLength);

  return { frequencies, magnitudes, waves };
};
