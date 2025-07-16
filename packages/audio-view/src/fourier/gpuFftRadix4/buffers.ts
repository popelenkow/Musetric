import { GpuFourierParams } from '../gpuFourier';
import { utilsRadix4 } from '../utilsRadix4';

export type GpuFftRadix4ParamsShader = {
  windowSize: number;
  windowCount: number;
  reverseWidth: number;
};

const toParamsShader = (params: GpuFourierParams): GpuFftRadix4ParamsShader => ({
  windowSize: params.windowSize,
  windowCount: params.windowCount,
  reverseWidth: utilsRadix4.getReverseWidth(params.windowSize),
});

const defaultParams: GpuFourierParams = {
  windowSize: 0,
  windowCount: 0,
};

const defaultParamsShader = toParamsShader(defaultParams);

export type Buffers = {
  paramsValue: GpuFourierParams;
  paramsShader: GpuFftRadix4ParamsShader;
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

  const buffers: Buffers = {
    paramsValue: defaultParams,
    paramsShader: defaultParamsShader,
    params,
    reverseTable,
    trigTable,
    writeParams: (newParams: GpuFourierParams) => {
      buffers.paramsValue = newParams;
      buffers.paramsShader = toParamsShader(newParams);
      paramsArray[0] = newParams.windowSize;
      paramsArray[1] = newParams.windowCount;
      paramsArray[2] = reverseWidth;
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
