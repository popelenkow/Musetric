export type MagnitudeNormalizerParams = {
  windowSize: number;
  windowCount: number;
};

export type Buffers = {
  paramsValue: MagnitudeNormalizerParams;
  params: GPUBuffer;
  writeParams: (paramsValue: MagnitudeNormalizerParams) => void;
  destroy: () => void;
};

export const createBuffers = (device: GPUDevice) => {
  const paramsArray = new Uint32Array(2);
  const params = device.createBuffer({
    label: 'magnitude-normalizer-params-buffer',
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
