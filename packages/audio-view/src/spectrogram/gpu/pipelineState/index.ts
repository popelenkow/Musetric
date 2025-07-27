import {
  ComplexArray,
  ComplexGpuBuffer,
  CpuMarker,
  createComplexArray,
  ViewSize,
} from '../../../common';
import { PipelineConfigureOptions } from '../../pipeline';
import { createStateProgress, StateProgress } from './progress';
import { createSignalBuffer } from './signalBuffer';
import { createStateTexture, StateTexture } from './texture';

export type PipelineState = {
  options: PipelineConfigureOptions;
  viewSize: ViewSize;
  signal: ComplexGpuBuffer;
  signalArray: ComplexArray;
  texture: StateTexture;
  progress: StateProgress;
  configure: () => void;
  writeBuffers: (progress: number) => void;
  destroy: () => void;
};
export const createPipelineState = (device: GPUDevice, marker?: CpuMarker) => {
  const ref: PipelineState = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    options: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    viewSize: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    signal: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    signalArray: undefined!,
    texture: createStateTexture(device),
    progress: createStateProgress(device),
    configure: () => {
      const { windowSize } = ref.options;
      const { viewSize } = ref;
      const windowCount = viewSize.width;
      ref.signal?.real.destroy();
      ref.signal?.imag.destroy();
      ref.signal = createSignalBuffer(device, windowSize, windowCount);
      ref.signalArray = createComplexArray(windowSize * windowCount);
      ref.texture.resize(viewSize);
    },
    writeBuffers: (progress: number) => {
      const { signal, signalArray } = ref;
      device.queue.writeBuffer(signal.real, 0, signalArray.real);
      device.queue.writeBuffer(signal.imag, 0, signalArray.imag);
      ref.progress.write(progress);
    },
    destroy: () => {
      ref.signal?.real.destroy();
      ref.signal?.imag.destroy();
      ref.texture.destroy();
      ref.progress.destroy();
    },
  };
  ref.writeBuffers = marker?.(ref.writeBuffers) ?? ref.writeBuffers;
  return ref;
};
