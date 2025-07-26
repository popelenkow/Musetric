import { createCpuTimer, createGpuTimer, roundDuration } from '../../common';

export const timerLabels = [
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
export type TimerLabel = (typeof timerLabels)[number];
export type PipelineMetrics = Record<TimerLabel, number>;

const gpuLabels = [
  'filterWave',
  'fourierReverse',
  'fourierTransform',
  'magnitudify',
  'decibelify',
  'scaleView',
  'draw',
] as const satisfies TimerLabel[];

const cpuLabels = [
  'configure',
  'sliceWaves',
  'writeBuffers',
  'createCommand',
  'submitCommand',
  'total',
] as const satisfies TimerLabel[];

const create = (device: GPUDevice) => ({
  gpu: createGpuTimer(device, gpuLabels),
  cpu: createCpuTimer(cpuLabels),
});

type Timer = ReturnType<typeof create>;

export type PipelineTimer = {
  wrap: Timer['cpu']['wrap'];
  wrapAsync: Timer['cpu']['wrapAsync'];
  marker: Partial<Timer['gpu']['timestampWrites']>;
  resolve: (encoder: GPUCommandEncoder) => void;
  finish: () => Promise<void>;
  destroy: () => void;
};

export const createPipelineTimer = (
  device: GPUDevice,
  onMetrics?: (metrics: PipelineMetrics) => void,
): PipelineTimer => {
  if (!onMetrics) {
    return {
      wrap: (_, fn) => fn,
      wrapAsync: (_, fn) => fn,
      marker: {},
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
    marker: timer.gpu.timestampWrites,
    resolve: timer.gpu.resolve,
    finish: async () => {
      const gpuDuration = await timer.gpu.read();
      const cpuDuration = timer.cpu.read();
      const metrics: PipelineMetrics = {
        ...gpuDuration,
        ...cpuDuration,
        other: 0,
      };
      const gpuSum = gpuLabels.reduce((acc, key) => acc + metrics[key], 0);
      metrics.submitCommand = roundDuration(metrics.submitCommand - gpuSum);
      const sum = timerLabels
        .slice(0, -2)
        .reduce((acc, key) => acc + metrics[key], 0);
      metrics.other = roundDuration(metrics.total - sum);
      const sortedMetrics = timerLabels.reduce<PipelineMetrics>(
        (acc, key) => ({
          ...acc,
          [key]: metrics[key],
        }),
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        {} as PipelineMetrics,
      );
      onMetrics(sortedMetrics);
    },
    destroy: timer.gpu.destroy,
  };

  return pipelineTimer;
};
