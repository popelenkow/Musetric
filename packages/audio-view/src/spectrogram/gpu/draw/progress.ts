export type StateProgress = {
  buffer: GPUBuffer;
  write: (progress: number) => void;
  destroy: () => void;
};
export const createStateProgress = (device: GPUDevice): StateProgress => {
  const array = new Float32Array([1]);
  const buffer = device.createBuffer({
    label: 'pipeline-progress-buffer',
    size: array.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const ref: StateProgress = {
    buffer,
    write: (progress: number) => {
      array[0] = progress;
      device.queue.writeBuffer(buffer, 0, array);
    },
    destroy: () => {
      buffer.destroy();
    },
  };
  return ref;
};
