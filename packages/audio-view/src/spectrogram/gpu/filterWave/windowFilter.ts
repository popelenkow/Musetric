import { hammingWindowFilter } from '../../windowFilters';

export type StateWindowFilter = {
  buffer: GPUBuffer;
  resize: (windowSize: number) => void;
  destroy: () => void;
};
export const createWindowFilter = (device: GPUDevice): StateWindowFilter => {
  const ref: StateWindowFilter = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    buffer: undefined!,
    resize: (windowSize: number) => {
      const array = hammingWindowFilter(windowSize);
      const buffer = device.createBuffer({
        label: 'filter-wave-window-filter-buffer',
        size: array.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });
      device.queue.writeBuffer(buffer, 0, array);

      ref.buffer?.destroy();
      ref.buffer = buffer;
    },
    destroy: () => {
      ref.buffer?.destroy();
    },
  };
  return ref;
};
