export type FilterWaveParams = {
  windowSize: number;
  windowCount: number;
};

export type StateParams = {
  value: FilterWaveParams;
  buffer: GPUBuffer;
  write: (value: FilterWaveParams) => void;
  destroy: () => void;
};
export const createParams = (device: GPUDevice): StateParams => {
  const array = new Uint32Array(2);
  const buffer = device.createBuffer({
    label: 'filter-wave-params-buffer',
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
