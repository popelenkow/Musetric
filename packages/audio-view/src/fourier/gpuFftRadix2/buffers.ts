import { GpuFourierParams } from '../gpuFourier';
import { utilsRadix2 } from '../utilsRadix2';

const defaultParams: GpuFourierParams = {
  windowSize: 0,
  windowCount: 0,
};

export type Buffers = {
  paramsValue: GpuFourierParams;
  params: GPUBuffer;
  reverseTable: GPUBuffer;
  trigTable: GPUBuffer;
  writeParams: (params: GpuFourierParams) => void;
  destroy: () => void;
};
export const createBuffers = (
  device: GPUDevice,
  windowSize: number,
) => {
  const paramsArray = new Uint32Array(2);
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

  const buffers = {
    paramsValue: defaultParams,
    params,
    reverseTable,
    trigTable,
    writeParams: (value: GpuFourierParams) => {
      buffers.paramsValue = value;
      paramsArray[0] = value.windowSize;
      paramsArray[1] = value.windowCount;
      device.queue.writeBuffer(params, 0, paramsArray);
    },
    destroy: () => {
      params.destroy();
      reverseTable.destroy();
      trigTable.destroy();
    },
  };

  device.queue.writeBuffer(reverseTable, 0, reverseTableArray);
  device.queue.writeBuffer(trigTable, 0, trigTableArray);

  return buffers;
};
