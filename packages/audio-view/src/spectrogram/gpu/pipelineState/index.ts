import { ComplexGpuBuffer } from '../../../common';
import { ExtPipelineConfig } from '../../pipeline';
import { createSignalBuffer } from './signal';
import { createStateTexture, StateTexture } from './texture';

export type PipelineState = {
  config: ExtPipelineConfig;
  signal: ComplexGpuBuffer;
  texture: StateTexture;
  configure: () => void;
  zerofyImag: (encoder: GPUCommandEncoder) => void;
  destroy: () => void;
};
export const createPipelineState = (device: GPUDevice) => {
  const ref: PipelineState = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    config: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    signal: undefined!,
    texture: createStateTexture(device),
    configure: () => {
      const { windowSize, windowCount, viewSize, zeroPaddingFactor } =
        ref.config;
      const paddedWindowSize = windowSize * zeroPaddingFactor;
      ref.signal?.real.destroy();
      ref.signal?.imag.destroy();
      ref.signal = createSignalBuffer(device, paddedWindowSize, windowCount);
      ref.texture.resize(viewSize);
    },
    zerofyImag: (encoder) => {
      encoder.clearBuffer(ref.signal.imag);
    },
    destroy: () => {
      ref.signal?.real.destroy();
      ref.signal?.imag.destroy();
      ref.texture.destroy();
    },
  };
  return ref;
};
