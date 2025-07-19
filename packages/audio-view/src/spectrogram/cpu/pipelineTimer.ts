import { createCpuTimer } from '../../common';

export const cpuMetricKeys = [
  'resize',
  'sliceWaves',
  'fourier',
  'normalizeMagnitude',
  'normalizeDecibel',
  'scaleView',
  'draw',
  'total',
] as const;

const create = () => createCpuTimer(cpuMetricKeys);

type Timer = ReturnType<typeof create>;

export type PipelineProfile = ReturnType<Timer['read']>;

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
      onProfile(profile);
    },
  };
};
