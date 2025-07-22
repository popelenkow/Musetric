import { utilsRadix2 } from '../utilsRadix2';

export type StateReverseTable = {
  buffer: GPUBuffer;
  resize: (windowSize: number) => void;
  destroy: () => void;
};
export const createReverseTable = (device: GPUDevice) => {
  const state: StateReverseTable = {
    buffer: undefined!,
    resize: (windowSize) => {
      const array = utilsRadix2.createReverseTable(windowSize);

      const buffer = device.createBuffer({
        label: 'fft2-reverse-table-buffer',
        size: array.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });
      device.queue.writeBuffer(buffer, 0, array);

      state.buffer?.destroy();
      state.buffer = buffer;
    },
    destroy: () => {
      state.buffer?.destroy();
    },
  };

  return state;
};
