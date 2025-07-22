import { utilsRadix4 } from '../utilsRadix4';

export type StateTrigTable = {
  buffer: GPUBuffer;
  resize: (windowSize: number) => void;
  destroy: () => void;
};
export const createTrigTable = (device: GPUDevice) => {
  const state: StateTrigTable = {
    buffer: undefined!,
    resize: (windowSize) => {
      const array = utilsRadix4.createTrigTable(windowSize);
      const buffer = device.createBuffer({
        label: 'fft4-trig-table',
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
