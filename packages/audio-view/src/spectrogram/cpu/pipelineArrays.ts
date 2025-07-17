import { ComplexArray, createComplexArray } from '../../common';

export type PipelineArrays = {
  waves: ComplexArray;
  signal: ComplexArray;
  magnitudes: Float32Array;
  view: Uint8Array;
};
export const createPipelineArrays = (
  windowSize: number,
  windowCount: number,
  height: number,
): PipelineArrays => {
  const windowLength = windowSize * windowCount;
  const waves = createComplexArray(windowLength);
  const signal = createComplexArray(windowLength);
  const magnitudes = new Float32Array(windowLength / 2);
  const view = new Uint8Array(windowCount * height);

  return { waves, signal, magnitudes, view };
};
