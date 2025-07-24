import { ComplexArray, createComplexArray } from '../../common';

export type PipelineArrays = {
  signal: ComplexArray;
  view: Uint8Array;
  resize: (windowSize: number, windowCount: number, height: number) => void;
};

export const createPipelineArrays = (): PipelineArrays => {
  const arrays: PipelineArrays = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    signal: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    view: undefined!,
    resize: (windowSize, windowCount, height) => {
      const windowLength = windowSize * windowCount;
      arrays.signal = createComplexArray(windowLength);
      arrays.view = new Uint8Array(windowCount * height);
    },
  };

  return arrays;
};
