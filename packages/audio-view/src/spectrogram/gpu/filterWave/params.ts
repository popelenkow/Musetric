import { Config } from './state';

export type FilterWaveParams = {
  windowSize: number;
  paddedWindowSize: number;
  windowCount: number;
};

const toParams = (config: Config): FilterWaveParams => ({
  windowSize: config.windowSize,
  paddedWindowSize: config.windowSize * config.zeroPaddingFactor,
  windowCount: config.windowCount,
});

export type StateParams = {
  value: FilterWaveParams;
  buffer: GPUBuffer;
  write: (config: Config) => void;
  destroy: () => void;
};
export const createParams = (device: GPUDevice): StateParams => {
  const array = new Uint32Array(3);
  const buffer = device.createBuffer({
    label: 'filter-wave-params-buffer',
    size: array.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const ref: StateParams = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    value: undefined!,
    buffer,
    write: (config) => {
      ref.value = toParams(config);
      array[0] = ref.value.windowSize;
      array[1] = ref.value.paddedWindowSize;
      array[2] = ref.value.windowCount;
      device.queue.writeBuffer(buffer, 0, array);
    },
    destroy: () => {
      buffer.destroy();
    },
  };
  return ref;
};
