export type MagnitudifyParams = {
  windowSize: number;
  windowCount: number;
};

export type StateParams = {
  value: MagnitudifyParams;
  buffer: GPUBuffer;
  write: (value: MagnitudifyParams) => void;
  destroy: () => void;
};

export const createParams = (device: GPUDevice) => {
  const array = new Uint32Array(2);
  const buffer = device.createBuffer({
    label: 'magnitudify-params-buffer',
    size: array.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const ref: StateParams = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    value: undefined!,
    buffer,
    write: (value) => {
      ref.value = value;
      array[0] = value.windowSize;
      array[1] = value.windowCount;
      device.queue.writeBuffer(buffer, 0, array);
    },
    destroy: () => {
      buffer.destroy();
    },
  };
  return ref;
};
