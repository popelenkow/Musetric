export const createPipelineBuffers = (
  device: GPUDevice,
  windowSize: number,
  initWindowCount: number,
) => {
  const halfSize = windowSize / 2;
  let windowCount = initWindowCount;

  const createMagnitude = () =>
    device.createBuffer({
      label: 'pipeline-magnitude',
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
