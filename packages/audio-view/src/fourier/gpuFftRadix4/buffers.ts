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

  const createDataReal = () =>
    device.createBuffer({
      label: 'fft4-data-real',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    });
  const createDataImag = () =>
    device.createBuffer({
      label: 'fft4-data-imag',
      size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
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
    dataReal: createDataReal(),
    dataImag: createDataImag(),
    reverseWidth,
    resize: (newWindowCount: number) => {
      windowCount = newWindowCount;
      buffers.dataReal.destroy();
      buffers.dataImag.destroy();
      buffers.dataReal = createDataReal();
      buffers.dataImag = createDataImag();
      writeParams();
    },
    destroy: () => {
      params.destroy();
      reverseTable.destroy();
      trigTable.destroy();
      buffers.dataReal.destroy();
      buffers.dataImag.destroy();
    },
  };

  device.queue.writeBuffer(reverseTable, 0, reverseTableArray);
  device.queue.writeBuffer(trigTable, 0, trigTableArray);
  writeParams();

  return buffers;
};
export type Buffers = ReturnType<typeof createBuffers>;
