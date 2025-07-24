import { GpuFourierParams } from '../gpuFourier';

export type StateParams = {
  value: GpuFourierParams;
  buffer: GPUBuffer;
  write: (value: GpuFourierParams) => void;
  destroy: () => void;
};
export const createParams = (device: GPUDevice) => {
  const array = new Uint32Array(2);
  const buffer = device.createBuffer({
    label: 'fft2-params-buffer',
    size: array.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const state: StateParams = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    value: undefined!,
    buffer,
    write: (value) => {
      state.value = value;
      array[0] = value.windowSize;
      array[1] = value.windowCount;
      device.queue.writeBuffer(buffer, 0, array);
    },
    destroy: () => {
      buffer.destroy();
    },
  };

  return state;
};
