import {
  spectrogram,
  FourierMode,
  isGpuFourierMode,
  ViewColors,
} from '@musetric/audio-view';

export const runs = 10;
export const skipRuns = 10;
export const sampleRate = 44100;
export const minDecibel = -45;
export const progress = 0.5;

export const colors: ViewColors = {
  played: '#a26da8',
  unplayed: '#8d8eba',
  background: '#000000',
};

export const minFrequency = 120;
export const maxFrequency = 5000;

export const visibleTimeBefore = 2.0;
export const visibleTimeAfter = 2.0;

export const windowFilter: spectrogram.WindowFilterKey = 'hamming';
export const zeroPaddingFactor: spectrogram.ZeroPaddingFactor = 2;

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

const createWave = () => {
  const result = new Float32Array(sampleRate * 60 * 3);
  for (let i = 0; i < result.length; i++) {
    result[i] = Math.random() * 2 - 1;
  }
  return result;
};
export const wave = createWave();

export const getTimerLabels = (mode: FourierMode): readonly string[] =>
  isGpuFourierMode(mode)
    ? spectrogram.gpu.timerLabels
    : spectrogram.cpu.timerLabels;
