export type Params = {
  windowSize: number;
  windowCount: number;
};

export const createBuffers = (device: GPUDevice) => {
  const paramsArray = new Uint32Array(2);

  const params = device.createBuffer({
    label: 'magnitude-normalizer-params-buffer',
    size: paramsArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const buffers = {
    params,
    writeParams: (data: Params) => {
      paramsArray[0] = data.windowSize;
      paramsArray[1] = data.windowCount;
      device.queue.writeBuffer(params, 0, paramsArray);
    },
    destroy: () => {
      params.destroy();
    },
  };

  return buffers;
};
export type Buffers = ReturnType<typeof createBuffers>;
