import { createCpuTimer, roundDuration } from '../../common';

export const timerLabels = [
  'configure',
  'sliceWaves',
  'filterWave',
  'fourier',
  'magnitudify',
  'decibelify',
  'scaleView',
  'draw',
  'other',
  'total',
] as const;
export type TimerLabel = (typeof timerLabels)[number];
export type PipelineMetrics = Record<TimerLabel, number>;

const create = () => createCpuTimer(timerLabels);
type Timer = ReturnType<typeof create>;

export type PipelineTimer = {
  wrap: Timer['wrap'];
  wrapAsync: Timer['wrapAsync'];
  finish: () => void;
};

export const createPipelineTimer = (
  onMetrics?: (metrics: PipelineMetrics) => void,
): PipelineTimer => {
  if (!onMetrics) {
    return {
      wrap: (_label, fn) => fn,
      wrapAsync: (_label, fn) => fn,
      finish: async () => {
        /** Nothing */
      },
    };
  }

  const timer = create();

  return {
    wrap: timer.wrap,
    wrapAsync: timer.wrapAsync,
    finish: async () => {
      const metrics = timer.read();
      const sum = timerLabels
        .slice(0, -2)
        .reduce((acc, key) => acc + metrics[key], 0);
      metrics.other = roundDuration(metrics.total - sum);
      onMetrics(metrics);
    },
  };
};
