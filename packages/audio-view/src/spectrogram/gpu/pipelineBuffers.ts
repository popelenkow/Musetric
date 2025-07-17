import { ComplexGpuBuffer } from '../../common';

export type CreatePipelineBuffersOptions = {
  device: GPUDevice;
  windowSize: number;
  windowCount: number;
};

export type PipelineBuffers = {
  signal: ComplexGpuBuffer;
  magnitude: GPUBuffer;
  resize: (newWindowCount: number) => void;
  destroy: () => void;
};
export const createPipelineBuffers = (
  options: CreatePipelineBuffersOptions,
) => {
  const { device, windowSize } = options;
  const halfSize = windowSize / 2;
  let windowCount = options.windowCount;

  const createMagnitude = () =>
    device.createBuffer({
      label: 'pipeline-magnitude-buffer',
      size: halfSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });
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
    magnitude: createMagnitude(),
    resize: (newWindowCount: number) => {
      windowCount = newWindowCount;
      buffers.signal.real.destroy();
      buffers.signal.imag.destroy();
      buffers.magnitude.destroy();
      buffers.signal = createSignalBuffer();
      buffers.magnitude = createMagnitude();
    },
    destroy: () => {
      buffers.signal.real.destroy();
      buffers.signal.imag.destroy();
      buffers.magnitude.destroy();
    },
  };
  return buffers;
};
