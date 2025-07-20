import { ComplexArray, createComplexArray } from '../../common';

export type PipelineArrays = {
  signal: ComplexArray;
  view: Uint8Array;
};
export const createPipelineArrays = (
  windowSize: number,
  windowCount: number,
  height: number,
): PipelineArrays => {
  const windowLength = windowSize * windowCount;
  const signal = createComplexArray(windowLength);
  const view = new Uint8Array(windowCount * height);

  return { signal, view };
};
