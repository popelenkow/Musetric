import { ComplexGpuBuffer } from '../../common';

export type CreatePipelineBuffersOptions = {
  device: GPUDevice;
  windowSize: number;
  windowCount: number;
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
  const createDataBuffer = (): ComplexGpuBuffer => ({
    real: device.createBuffer({
      label: 'pipeline-data-real-buffer',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    }),
    imag: device.createBuffer({
      label: 'pipeline-data-imag-buffer',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    }),
  });

  const buffers = {
    data: createDataBuffer(),
    magnitude: createMagnitude(),
    resize: (newWindowCount: number) => {
      windowCount = newWindowCount;
      buffers.data.real.destroy();
      buffers.data.imag.destroy();
      buffers.magnitude.destroy();
      buffers.data = createDataBuffer();
      buffers.magnitude = createMagnitude();
    },
    destroy: () => {
      buffers.data.real.destroy();
      buffers.data.imag.destroy();
      buffers.magnitude.destroy();
    },
  };
  return buffers;
};
