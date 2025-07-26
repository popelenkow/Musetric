export type DecibelifyParams = {
  halfSize: number;
  windowCount: number;
  minDecibel: number;
};

export type StateParams = {
  value: DecibelifyParams;
  buffer: GPUBuffer;
  write: (value: DecibelifyParams) => void;
  destroy: () => void;
};
export const createParams = (device: GPUDevice) => {
  const array = new DataView(new ArrayBuffer(12));
  const buffer = device.createBuffer({
    label: 'decibelify-params-buffer',
    size: array.buffer.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const ref: StateParams = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    value: undefined!,
    buffer,
    write: (value) => {
      ref.value = value;
      array.setUint32(0, value.halfSize, true);
      array.setUint32(4, value.windowCount, true);
      array.setFloat32(8, value.minDecibel, true);
      device.queue.writeBuffer(buffer, 0, array.buffer);
    },
    destroy: () => {
      buffer.destroy();
    },
  };
  return ref;
};
