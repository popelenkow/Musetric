import { utilsRadix2 } from '../utilsRadix2';

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
  const reverseTableArray = utilsRadix2.createReverseTable(windowSize);
  const trigTableArray = utilsRadix2.createTrigTable(windowSize);

  const params = device.createBuffer({
    label: 'fft2-params-buffer',
    size: paramsArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const reverseTable = device.createBuffer({
    label: 'fft2-reverse-table-buffer',
    size: reverseTableArray.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  const trigTable = device.createBuffer({
    label: 'fft2-trig-table-buffer',
    size: trigTableArray.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  const createInputReal = () =>
    device.createBuffer({
      label: 'fft2-input-real-buffer',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
  const createInputImag = () =>
    device.createBuffer({
      label: 'fft2-input-imag-buffer',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
  const createOutputReal = () =>
    device.createBuffer({
      label: 'fft2-output-real-buffer',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });
  const createOutputImag = () =>
    device.createBuffer({
      label: 'fft2-output-imag-buffer',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

  device.queue.writeBuffer(reverseTable, 0, reverseTableArray);
  device.queue.writeBuffer(trigTable, 0, trigTableArray);

  const buffers = {
    params,
    reverseTable,
    trigTable,
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
      reverseTable.destroy();
      trigTable.destroy();
      buffers.inputReal.destroy();
      buffers.inputImag.destroy();
      buffers.outputReal.destroy();
      buffers.outputImag.destroy();
    },
  };
  return buffers;
};
export type Buffers = ReturnType<typeof createBuffers>;
