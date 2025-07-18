import { ComplexArray, createComplexArray } from '../../common';

export type PipelineArrays = {
  waves: ComplexArray;
  signal: ComplexArray;
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
  const view = new Uint8Array(windowCount * height);

  return { waves, signal, view };
};
