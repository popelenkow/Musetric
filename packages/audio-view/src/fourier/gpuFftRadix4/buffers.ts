import { utilsRadix4 } from '../utilsRadix4';

export type Params = {
  windowSize: number;
  windowCount: number;
  reverseWidth: number;
};

export const createBuffers = (
  device: GPUDevice,
  windowSize: number,
  initWindowCount: number,
) => {
  let windowCount = initWindowCount;
  const reverseWidth = utilsRadix4.getReverseWidth(windowSize);

  const paramsArray = new Uint32Array(3);
  const reverseTableArray = utilsRadix4.createReverseTable(reverseWidth);
  const trigTableArray = utilsRadix4.createTrigTable(windowSize);

  const params = device.createBuffer({
    label: 'fft4-params',
    size: paramsArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const reverseTable = device.createBuffer({
    label: 'fft4-reverse-table',
    size: reverseTableArray.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  const trigTable = device.createBuffer({
    label: 'fft4-trig-table',
    size: trigTableArray.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const createInputReal = () =>
    device.createBuffer({
      label: 'fft4-input-real',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
  const createInputImag = () =>
    device.createBuffer({
      label: 'fft4-input-imag',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
  const createOutputReal = () =>
    device.createBuffer({
      label: 'fft4-output-real',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });
  const createOutputImag = () =>
    device.createBuffer({
      label: 'fft4-output-imag',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

  const writeParams = () => {
    paramsArray[0] = windowSize;
    paramsArray[1] = windowCount;
    paramsArray[2] = reverseWidth;
    device.queue.writeBuffer(params, 0, paramsArray);
  };

  const buffers = {
    params,
    reverseTable,
    trigTable,
    inputReal: createInputReal(),
    inputImag: createInputImag(),
    outputReal: createOutputReal(),
    outputImag: createOutputImag(),
    reverseWidth,
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
      writeParams();
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

  device.queue.writeBuffer(reverseTable, 0, reverseTableArray);
  device.queue.writeBuffer(trigTable, 0, trigTableArray);
  writeParams();

  return buffers;
};
export type Buffers = ReturnType<typeof createBuffers>;
