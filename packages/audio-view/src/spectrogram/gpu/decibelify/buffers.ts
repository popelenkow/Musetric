export type DecibelifyParams = {
  halfSize: number;
  windowCount: number;
  minDecibel: number;
};

const defaultParams: DecibelifyParams = {
  halfSize: 0,
  windowCount: 0,
  minDecibel: 0,
};

export type Buffers = {
  paramsValue: DecibelifyParams;
  params: GPUBuffer;
  writeParams: (params: DecibelifyParams) => void;
  destroy: () => void;
};

export const createBuffers = (device: GPUDevice) => {
  const paramsArray = new DataView(new ArrayBuffer(12));

  const params = device.createBuffer({
    label: 'decibelify-params-buffer',
    size: paramsArray.buffer.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const buffers: Buffers = {
    paramsValue: defaultParams,
    params,
    writeParams: (value: DecibelifyParams) => {
      buffers.paramsValue = value;
      paramsArray.setUint32(0, value.halfSize, true);
      paramsArray.setUint32(4, value.windowCount, true);
      paramsArray.setFloat32(8, value.minDecibel, true);
      device.queue.writeBuffer(params, 0, paramsArray.buffer);
    },
    destroy: () => {
      params.destroy();
    },
  };

  return buffers;
};
