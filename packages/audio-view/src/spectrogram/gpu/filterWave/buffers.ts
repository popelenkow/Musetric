export type FilterWaveParams = {
  windowSize: number;
  windowCount: number;
};

export type Buffers = {
  paramsValue: FilterWaveParams;
  params: GPUBuffer;
  writeParams: (params: FilterWaveParams) => void;
  destroy: () => void;
};

export const createBuffers = (device: GPUDevice): Buffers => {
  const paramsArray = new Uint32Array(2);
  const params = device.createBuffer({
    label: 'filter-wave-params-buffer',
    size: paramsArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const buffers: Buffers = {
    paramsValue: { windowSize: 0, windowCount: 0 },
    params,
    writeParams: (value) => {
      buffers.paramsValue = value;
      paramsArray[0] = value.windowSize;
      paramsArray[1] = value.windowCount;
      device.queue.writeBuffer(params, 0, paramsArray);
    },
    destroy: () => {
      params.destroy();
    },
  };

  return buffers;
};
