import { createCpuTimer, createGpuTimer } from '../../common';

export const gpuMetricKeys = [
  'resize',
  'createCommand',
  'sliceWaves',
  'writeGpuWaves',
  'fourierReverse',
  'fourierTransform',
  'normalizeMagnitude',
  'normalizeDecibel',
  'scaleView',
  'draw',
  'total',
] as const;

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

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
export type PipelineProfile = Prettify<
  ReturnType<Timer['cpu']['read']> & Awaited<ReturnType<Timer['gpu']['read']>>
>;

export type PipelineTimer = {
  wrap: Timer['cpu']['wrap'];
  wrapAsync: Timer['cpu']['wrapAsync'];
  tw: Partial<Timer['gpu']['timestampWrites']>;
  resolve: (encoder: GPUCommandEncoder) => void;
  finish: () => Promise<void>;
  destroy: () => void;
};

export const createPipelineTimer = (
  device: GPUDevice,
  onProfile?: (profile: PipelineProfile) => void,
): PipelineTimer => {
  if (!onProfile) {
    return {
      wrap: (_, fn) => fn,
      wrapAsync: (_, fn) => fn,
      tw: {},
      resolve: () => {
        /** Nothing */
      },
      finish: async () => {
        /** Nothing */
      },
      destroy: () => {
        /** Nothing */
      },
    };
  }

  const timer = create(device);
  const pipelineTimer: PipelineTimer = {
    wrap: timer.cpu.wrap,
    wrapAsync: timer.cpu.wrapAsync,
    tw: timer.gpu.timestampWrites,
    resolve: timer.gpu.resolve,
    finish: async () => {
      const gpuDuration = await timer.gpu.read();
      const cpuDuration = timer.cpu.read();
      const profile: PipelineProfile = {
        ...gpuDuration,
        ...cpuDuration,
      };
      onProfile(profile);
    },
    destroy: timer.gpu.destroy,
  };

  return pipelineTimer;
};
