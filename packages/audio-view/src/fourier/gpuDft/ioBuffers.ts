export const createIoBuffers = (
  device: GPUDevice,
  windowSize: number,
  windowCount: number,
) => {
  const totalSize = windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT;

  const inputReal = device.createBuffer({
    label: 'dft-input-real',
    size: totalSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  const inputImag = device.createBuffer({
    label: 'dft-input-imag',
    size: totalSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  const outputReal = device.createBuffer({
    label: 'dft-output-real',
    size: totalSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });
  const outputImag = device.createBuffer({
    label: 'dft-output-imag',
    size: totalSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  return {
    inputReal,
    inputImag,
    outputReal,
    outputImag,
    destroy: () => {
      inputReal.destroy();
      inputImag.destroy();
      outputReal.destroy();
      outputImag.destroy();
    },
  };
};
export type IoBuffers = ReturnType<typeof createIoBuffers>;
