import { utilsRadix4 } from '../utilsRadix4';

export const paramsCount = 4;

export type Params = {
  windowSize: number;
  windowCount: number;
  reverseWidth: number;
  inverse: boolean;
};

export const createParams = () => {
  const instance = new Uint32Array(paramsCount);
  return {
    instance,
    set: (params: Params) => {
      instance[0] = params.windowSize;
      instance[1] = params.windowCount;
      instance[2] = params.reverseWidth;
      instance[3] = params.inverse ? 1 : 0;
    },
  };
};

export const createStaticBuffers = (device: GPUDevice, windowSize: number) => {
  const reverseWidth = utilsRadix4.getReverseWidth(windowSize);
  const reverseTable = utilsRadix4.createReverseTable(reverseWidth);
  const trigTable = utilsRadix4.createTrigTable(windowSize);

  const params = device.createBuffer({
    label: 'fft4-params',
    size: paramsCount * Uint32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const reverseTableBuf = device.createBuffer({
    label: 'fft4-reverse-table',
    size: reverseTable.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(reverseTableBuf, 0, reverseTable);

  const trigTableBuf = device.createBuffer({
    label: 'fft4-trig-table',
    size: trigTable.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(trigTableBuf, 0, trigTable);

  return {
    params,
    reverseTable: reverseTableBuf,
    trigTable: trigTableBuf,
    reverseWidth,
    destroy: () => {
      params.destroy();
      reverseTableBuf.destroy();
      trigTableBuf.destroy();
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
    label: 'fft4-input-real',
    size: totalSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  const inputImag = device.createBuffer({
    label: 'fft4-input-imag',
    size: totalSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  const outputReal = device.createBuffer({
    label: 'fft4-output-real',
    size: totalSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });
  const outputImag = device.createBuffer({
    label: 'fft4-output-imag',
    size: totalSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });
  const readReal = device.createBuffer({
    label: 'fft4-read-real',
    size: totalSize,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });
  const readImag = device.createBuffer({
    label: 'fft4-read-imag',
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
    label: 'fft4-bind-group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: buffers.inputReal } },
      { binding: 1, resource: { buffer: buffers.inputImag } },
      { binding: 2, resource: { buffer: buffers.outputReal } },
      { binding: 3, resource: { buffer: buffers.outputImag } },
      { binding: 4, resource: { buffer: buffers.reverseTable } },
      { binding: 5, resource: { buffer: buffers.trigTable } },
      { binding: 6, resource: { buffer: buffers.params } },
    ],
  });
