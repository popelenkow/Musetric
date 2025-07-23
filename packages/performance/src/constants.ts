import {
  spectrogram,
  FourierMode,
  isGpuFourierMode,
} from '@musetric/audio-view';

export const runs = 10;
export const skipRuns = 10;
export const sampleRate = 44100;
export const minDecibel = -45;

export const colors: spectrogram.Colors = {
  played: '#a26da8',
  unplayed: '#8d8eba',
  background: '#000000',
};

export const viewParams: spectrogram.SignalViewParams = {
  sampleRate,
  minFrequency: 120,
  maxFrequency: 5000,
};

export const canvasWidth = 1920;
export const canvasHeight = 1080;

const getWindowSizes = () => {
  const sizes: number[] = [];
  for (let size = 64; size <= 1024 * 16; size *= 2) {
    sizes.push(size);
  }
  return sizes;
};
export const windowSizes = getWindowSizes();

export const getMetricKeys = (mode: FourierMode): readonly string[] =>
  isGpuFourierMode(mode)
    ? spectrogram.gpu.metricKeys
    : spectrogram.cpu.metricKeys;
