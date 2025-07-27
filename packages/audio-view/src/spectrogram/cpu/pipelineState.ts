import { ComplexArray, CpuMarker, createComplexArray } from '../../common';
import { PipelineConfigureOptions } from '../pipeline';

export type PipelineArrays = {
  options: PipelineConfigureOptions;
  signal: ComplexArray;
  view: Uint8Array;
  configure: () => void;
  zerofyImag: () => void;
};
export const createPipelineState = (marker?: CpuMarker): PipelineArrays => {
  const ref: PipelineArrays = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    options: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    signal: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    view: undefined!,
    configure: () => {
      const { windowSize, viewSize } = ref.options;
      const { width, height } = viewSize;
      const windowCount = width;
      const windowLength = windowSize * windowCount;
      ref.signal = createComplexArray(windowLength);
      ref.view = new Uint8Array(windowCount * height);
    },
    zerofyImag: () => {
      ref.signal.imag.fill(0);
    },
  };
  ref.zerofyImag = marker?.(ref.zerofyImag) ?? ref.zerofyImag;
  return ref;
};
