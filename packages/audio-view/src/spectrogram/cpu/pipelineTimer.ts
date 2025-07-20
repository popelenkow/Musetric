import { createCpuTimer, roundDuration } from '../../common';

export const cpuMetricKeys = [
  'resize',
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
export type CpuMetricKey = (typeof cpuMetricKeys)[number];
export type PipelineProfile = Record<CpuMetricKey, number>;

const create = () => createCpuTimer(cpuMetricKeys);
type Timer = ReturnType<typeof create>;

export type PipelineTimer = {
  wrap: Timer['wrap'];
  wrapAsync: Timer['wrapAsync'];
  finish: () => void;
};

export const createPipelineTimer = (
  onProfile?: (profile: PipelineProfile) => void,
): PipelineTimer => {
  if (!onProfile) {
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
      const profile = timer.read();
      const sum = cpuMetricKeys
        .slice(0, -2)
        .reduce((acc, key) => acc + profile[key], 0);
      profile.other = roundDuration(profile.total - sum);
      onProfile(profile);
    },
  };
};
