import { ComplexArray, createComplexArray, ViewSize } from '../../common';
import { PipelineConfigureOptions } from '../pipeline';

export type PipelineArrays = {
  options: PipelineConfigureOptions;
  viewSize: ViewSize;
  signal: ComplexArray;
  view: Uint8Array;
  configure: () => void;
};

export const createPipelineState = (): PipelineArrays => {
  const ref: PipelineArrays = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    options: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    viewSize: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    signal: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    view: undefined!,
    configure: () => {
      const { windowSize } = ref.options;
      const { width, height } = ref.viewSize;
      const windowCount = width;
      const windowLength = windowSize * windowCount;
      ref.signal = createComplexArray(windowLength);
      ref.view = new Uint8Array(windowCount * height);
    },
  };
  return ref;
};
