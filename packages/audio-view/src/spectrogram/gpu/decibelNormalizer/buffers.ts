export type Params = {
  halfSize: number;
  windowCount: number;
  minDecibel: number;
};

export const createBuffers = (device: GPUDevice) => {
  const paramsArray = new DataView(new ArrayBuffer(12));

  const params = device.createBuffer({
    label: 'norm-db-params',
    size: paramsArray.buffer.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const buffers = {
    params,
    writeParams: (data: Params) => {
      paramsArray.setUint32(0, data.halfSize, true);
      paramsArray.setUint32(4, data.windowCount, true);
      paramsArray.setFloat32(8, data.minDecibel, true);
      device.queue.writeBuffer(params, 0, paramsArray.buffer);
    },
    destroy: () => {
      params.destroy();
    },
  };

  return buffers;
};
export type Buffers = ReturnType<typeof createBuffers>;
