import { createCpuTimer, createGpuTimer } from '../../common';

const create = (device: GPUDevice) => ({
  gpu: createGpuTimer(device, [
    'fourierReverse',
    'fourierTransform',
    'magnitudeNormalizer',
    'decibelNormalizer',
    'logSlicer',
    'drawer',
  ]),
  cpu: createCpuTimer([
    'resize',
    'createCommand',
    'sliceWaves',
    'writeGpuWaves',
    'total',
  ]),
});

type Timer = ReturnType<typeof create>;

export type PipelineTimer = {
  wrap: Timer['cpu']['wrap'];
  wrapAsync: Timer['cpu']['wrapAsync'];
  tw: Partial<Timer['gpu']['timestampWrites']>;
  resolve: (encoder: GPUCommandEncoder) => void;
  read?: () => Promise<Record<string, number>>;
  destroy: () => void;
};

export const createPipelineTimer = (
  device: GPUDevice,
  profiling?: boolean,
): PipelineTimer => {
  if (!profiling) {
    return {
      wrap: (_, fn) => fn,
      wrapAsync: (_, fn) => fn,
      tw: {},
      resolve: () => {
        /** Nothing */
      },
      read: () => Promise.resolve({}),
      destroy: () => {
        /** Nothing */
      },
    };
  }
  const timer = create(device);

  return {
    wrap: timer.cpu.wrap,
    wrapAsync: timer.cpu.wrapAsync,
    tw: timer.gpu.timestampWrites,
    resolve: timer.gpu.resolve,
    read: async () => {
      const gpuDuration = await timer.gpu.read();
      const cpuDuration = timer.cpu.read();
      return {
        ...gpuDuration,
        ...cpuDuration,
      };
    },
    destroy: timer.gpu.destroy,
  };
};
