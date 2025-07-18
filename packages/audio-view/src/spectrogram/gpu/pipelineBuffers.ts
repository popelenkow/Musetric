import { ComplexGpuBuffer } from '../../common';

export type CreatePipelineBuffersOptions = {
  device: GPUDevice;
  windowSize: number;
  windowCount: number;
};

export type PipelineBuffers = {
  signal: ComplexGpuBuffer;
  resize: (newWindowCount: number) => void;
  destroy: () => void;
};
export const createPipelineBuffers = (
  options: CreatePipelineBuffersOptions,
) => {
  const { device, windowSize } = options;
  let windowCount = options.windowCount;

  const createSignalBuffer = (): ComplexGpuBuffer => ({
    real: device.createBuffer({
      label: 'pipeline-signal-real-buffer',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    }),
    imag: device.createBuffer({
      label: 'pipeline-signal-imag-buffer',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    }),
  });

  const buffers: PipelineBuffers = {
    signal: createSignalBuffer(),
    resize: (newWindowCount: number) => {
      windowCount = newWindowCount;
      buffers.signal.real.destroy();
      buffers.signal.imag.destroy();
      buffers.signal = createSignalBuffer();
    },
    destroy: () => {
      buffers.signal.real.destroy();
      buffers.signal.imag.destroy();
    },
  };
  return buffers;
};
