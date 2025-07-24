import { createCpuTimer, createGpuTimer, roundDuration } from '../../common';

export const metricKeys = [
  'configure',
  'sliceWaves',
  'writeBuffers',
  'createCommand',
  'submitCommand',
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
export type MetricKey = (typeof metricKeys)[number];
export type PipelineProfile = Record<MetricKey, number>;

const gpuKeys = [
  'filterWave',
  'fourierReverse',
  'fourierTransform',
  'magnitudify',
  'decibelify',
  'scaleView',
  'draw',
] as const satisfies MetricKey[];

const cpuKeys = [
  'configure',
  'sliceWaves',
  'writeBuffers',
  'createCommand',
  'submitCommand',
  'total',
] as const satisfies MetricKey[];

const create = (device: GPUDevice) => ({
  gpu: createGpuTimer(device, gpuKeys),
  cpu: createCpuTimer(cpuKeys),
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
      const gpuSum = gpuKeys.reduce((acc, key) => acc + profile[key], 0);
      profile.submitCommand = roundDuration(profile.submitCommand - gpuSum);
      const sum = metricKeys
        .slice(0, -2)
        .reduce((acc, key) => acc + profile[key], 0);
      profile.other = roundDuration(profile.total - sum);
      const sortedProfile = metricKeys.reduce<PipelineProfile>(
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
