import { createCpuTimer, createGpuTimer } from '../../common';

const create = (device: GPUDevice) => ({
  gpu: createGpuTimer(device, [
    'fourierReverse',
    'fourierTransform',
    'normalizeMagnitude',
    'normalizeDecibel',
    'scaleView',
    'draw',
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
type ReadResult = ReturnType<Timer['cpu']['read']> &
  Awaited<ReturnType<Timer['gpu']['read']>>;

export type PipelineTimer = {
  wrap: Timer['cpu']['wrap'];
  wrapAsync: Timer['cpu']['wrapAsync'];
  tw: Partial<Timer['gpu']['timestampWrites']>;
  resolve: (encoder: GPUCommandEncoder) => void;
  read?: () => Promise<ReadResult>;
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
      read: undefined,
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
