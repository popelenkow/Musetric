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

  const buffers = {
    magnitude: createMagnitude(),
    resize: (newWindowCount: number) => {
      windowCount = newWindowCount;
      buffers.magnitude.destroy();
      buffers.magnitude = createMagnitude();
    },
    destroy: () => {
      buffers.magnitude.destroy();
    },
  };
  return buffers;
};
