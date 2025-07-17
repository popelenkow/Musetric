import { createCpuTimer } from '../../common';

const create = () =>
  createCpuTimer([
    'fourier',
    'normalizeMagnitude',
    'normalizeDecibel',
    'scaleView',
    'draw',
    'resize',
    'sliceWaves',
    'total',
  ]);

type Timer = ReturnType<typeof create>;

export type PipelineTimer = {
  wrap: Timer['wrap'];
  wrapAsync: Timer['wrapAsync'];
  read?: () => ReturnType<Timer['read']>;
};

export const createPipelineTimer = (profiling?: boolean): PipelineTimer => {
  if (!profiling) {
    return {
      wrap: (_label, fn) => fn,
      wrapAsync: (_label, fn) => fn,
      read: undefined,
    };
  }

  const timer = create();

  return {
    wrap: timer.wrap,
    wrapAsync: timer.wrapAsync,
    read: timer.read,
  };
};
