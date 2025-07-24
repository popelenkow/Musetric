import { utilsRadix2 } from '../utilsRadix2';

export type StateTrigTable = {
  buffer: GPUBuffer;
  resize: (windowSize: number) => void;
  destroy: () => void;
};
export const createTrigTable = (device: GPUDevice) => {
  const state: StateTrigTable = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    buffer: undefined!,
    resize: (windowSize) => {
      const array = utilsRadix2.createTrigTable(windowSize);
      const buffer = device.createBuffer({
        label: 'fft2-trig-table-buffer',
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
