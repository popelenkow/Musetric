export type FilterWaveParams = {
  windowSize: number;
  windowCount: number;
};

export type Buffers = {
  paramsValue: FilterWaveParams;
  params: GPUBuffer;
  coefficients: GPUBuffer;
  writeParams: (params: FilterWaveParams) => void;
  destroy: () => void;
};

import { hammingWindowFilter } from '../../windowFilters';

export const createBuffers = (
  device: GPUDevice,
  windowSize: number,
): Buffers => {
  const paramsArray = new Uint32Array(2);
  const windowFilterArray = hammingWindowFilter(windowSize);

  const params = device.createBuffer({
    label: 'filter-wave-params-buffer',
    size: paramsArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const windowFilter = device.createBuffer({
    label: 'filter-wave-window-filter-buffer',
    size: windowSize * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const buffers: Buffers = {
    paramsValue: { windowSize, windowCount: 0 },
    params,
    coefficients: windowFilter,
    writeParams: (value) => {
      buffers.paramsValue = value;
      paramsArray[0] = value.windowSize;
      paramsArray[1] = value.windowCount;
      device.queue.writeBuffer(params, 0, paramsArray);
    },
    destroy: () => {
      params.destroy();
      windowFilter.destroy();
    },
  };

  device.queue.writeBuffer(windowFilter, 0, windowFilterArray);

  return buffers;
};
