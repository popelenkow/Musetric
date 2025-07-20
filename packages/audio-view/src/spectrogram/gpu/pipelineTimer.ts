import { createCpuTimer, createGpuTimer, roundDuration } from '../../common';

export const gpuMetricKeys = [
  'resize',
  'sliceWaves',
  'writeGpuBuffers',
  'createCommand',
  'filterWave',
  'fourierReverse',
  'fourierTransform',
  'magnitudify',
  'decibelify',
  'scaleView',
  'draw',
  'other',
  'total',
] as const;
export type GpuMetricKey = (typeof gpuMetricKeys)[number];
export type PipelineProfile = Record<GpuMetricKey, number>;

const create = (device: GPUDevice) => ({
  gpu: createGpuTimer(device, [
    'filterWave',
    'fourierReverse',
    'fourierTransform',
    'magnitudify',
    'decibelify',
    'scaleView',
    'draw',
  ]),
  cpu: createCpuTimer([
    'resize',
    'sliceWaves',
    'writeGpuBuffers',
    'createCommand',
    'total',
  ]),
});

type Timer = ReturnType<typeof create>;

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
        other: 0,
      };
      const sum = gpuMetricKeys
        .slice(0, -2)
        .reduce((acc, key) => acc + profile[key], 0);
      profile.other = roundDuration(profile.total - sum);
      const sortedProfile = gpuMetricKeys.reduce<PipelineProfile>(
        (acc, key) => ({
          ...acc,
          [key]: profile[key],
        }),
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        {} as PipelineProfile,
      );
      onProfile(sortedProfile);
    },
    destroy: timer.gpu.destroy,
  };

  return pipelineTimer;
};
