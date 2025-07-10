export type Params = {
  windowSize: number;
  windowCount: number;
  inverse: boolean;
};

export const createBuffers = (
  device: GPUDevice,
  windowSize: number,
  initWindowCount: number,
) => {
  let windowCount = initWindowCount;

  const paramsArray = new Uint32Array(3);

  const params = device.createBuffer({
    label: 'dft-params',
    size: paramsArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const createInputReal = () =>
    device.createBuffer({
      label: 'dft-input-real',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
  const createInputImag = () =>
    device.createBuffer({
      label: 'dft-input-imag',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
  const createOutputReal = () =>
    device.createBuffer({
      label: 'dft-output-real',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });
  const createOutputImag = () =>
    device.createBuffer({
      label: 'dft-output-imag',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

  const buffers = {
    params,
    inputReal: createInputReal(),
    inputImag: createInputImag(),
    outputReal: createOutputReal(),
    outputImag: createOutputImag(),
    resize: (newWindowCount: number) => {
      windowCount = newWindowCount;
      buffers.inputReal.destroy();
      buffers.inputImag.destroy();
      buffers.outputReal.destroy();
      buffers.outputImag.destroy();
      buffers.inputReal = createInputReal();
      buffers.inputImag = createInputImag();
      buffers.outputReal = createOutputReal();
      buffers.outputImag = createOutputImag();
    },
    writeParams: (data: Params) => {
      paramsArray[0] = data.windowSize;
      paramsArray[1] = data.windowCount;
      paramsArray[2] = data.inverse ? 1 : 0;
      device.queue.writeBuffer(buffers.params, 0, paramsArray);
    },
    destroy: () => {
      params.destroy();
      buffers.inputReal.destroy();
      buffers.inputImag.destroy();
      buffers.outputReal.destroy();
      buffers.outputImag.destroy();
    },
  };

  return buffers;
};
export type Buffers = ReturnType<typeof createBuffers>;
