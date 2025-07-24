export type StateProgress = {
  buffer: GPUBuffer;
  write: (value: number) => void;
  destroy: () => void;
};
export const createProgress = (device: GPUDevice): StateProgress => {
  const array = new Float32Array([1]);
  const buffer = device.createBuffer({
    label: 'draw-progress-buffer',
    size: array.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const state: StateProgress = {
    buffer,
    write: (value: number) => {
      array[0] = value;
      device.queue.writeBuffer(buffer, 0, array);
    },
    destroy: () => {
      buffer.destroy();
    },
  };

  return state;
};
