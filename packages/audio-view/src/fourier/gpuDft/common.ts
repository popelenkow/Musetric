export const paramsCount = 3;

export type Params = {
  windowSize: number;
  windowCount: number;
  inverse: boolean;
};

export const createParams = () => {
  const instance = new Uint32Array(paramsCount);
  return {
    instance,
    set: (params: Params) => {
      instance[0] = params.windowSize;
      instance[1] = params.windowCount;
      instance[2] = params.inverse ? 1 : 0;
    },
  };
};

export const createStaticBuffers = (device: GPUDevice) => {
  const params = device.createBuffer({
    label: 'dft-params',
    size: paramsCount * Uint32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  return {
    params,
    destroy: () => {
      params.destroy();
    },
  };
};
export type StaticBuffers = ReturnType<typeof createStaticBuffers>;

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
  const readReal = device.createBuffer({
    label: 'dft-read-real',
    size: totalSize,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });
  const readImag = device.createBuffer({
    label: 'dft-read-imag',
    size: totalSize,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  return {
    inputReal,
    inputImag,
    outputReal,
    outputImag,
    readReal,
    readImag,
    destroy: () => {
      inputReal.destroy();
      inputImag.destroy();
      outputReal.destroy();
      outputImag.destroy();
      readReal.destroy();
      readImag.destroy();
    },
  };
};
export type IoBuffers = ReturnType<typeof createIoBuffers>;

export const createBindGroup = (
  device: GPUDevice,
  pipeline: GPUComputePipeline,
  buffers: StaticBuffers & IoBuffers,
) =>
  device.createBindGroup({
    label: 'dft-bind-group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: buffers.inputReal } },
      { binding: 1, resource: { buffer: buffers.inputImag } },
      { binding: 2, resource: { buffer: buffers.outputReal } },
      { binding: 3, resource: { buffer: buffers.outputImag } },
      { binding: 4, resource: { buffer: buffers.params } },
    ],
  });
