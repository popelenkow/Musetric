import {
  spectrogram,
  cpuFouriers,
  gpuFouriers,
  FourierMode,
  isGpuFourierMode,
} from '../src';
import { cpuMetricKeys } from '../src/spectrogram/cpu/pipelineTimer';
import { gpuMetricKeys } from '../src/spectrogram/gpu';

export const runs = 10;
export const skipRuns = 10;
export const sampleRate = 44100;
export const minDecibel = -40;

export const colors: spectrogram.Colors = {
  played: '#a26da8',
  unplayed: '#8d8eba',
  background: '#000000',
};

export const viewParams: spectrogram.SignalViewParams = {
  sampleRate,
  minFrequency: sampleRate * 0.001,
  maxFrequency: sampleRate * 0.1,
};

const getWindowSizes = () => {
  const sizes: number[] = [];
  for (let size = 64; size <= 1024 * 16; size *= 2) {
    sizes.push(size);
  }
  return sizes;
};
export const windowSizes = getWindowSizes();

export const fourierModes: FourierMode[] = [
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ...(Object.keys(gpuFouriers) as Array<keyof typeof gpuFouriers>),
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ...(Object.keys(cpuFouriers) as Array<keyof typeof cpuFouriers>),
];
export const getMetricKeys = (mode: FourierMode): readonly string[] =>
  isGpuFourierMode(mode) ? gpuMetricKeys : cpuMetricKeys;
