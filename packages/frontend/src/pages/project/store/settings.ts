import { spectrogram, FourierMode, ViewColors } from '@musetric/audio-view';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type SettingsState = Omit<
  spectrogram.PipelineConfig,
  'sampleRate' | 'viewSize'
> & {
  fourierMode: FourierMode;
  open: boolean;
};

const initialState: SettingsState = {
  ...spectrogram.defaultConfig,
  fourierMode: 'gpuFftRadix4',
  open: false,
};

export type SettingsActions = {
  setFourierMode: (mode: FourierMode) => void;
  setWindowFilter: (value: spectrogram.WindowFilterKey) => void;
  setWindowSize: (size: number) => void;
  setMinFrequency: (value: number) => void;
  setMaxFrequency: (value: number) => void;
  setMinDecibel: (value: number) => void;
  setVisibleTimeBefore: (value: number) => void;
  setVisibleTimeAfter: (value: number) => void;
  setZeroPaddingFactor: (value: spectrogram.ZeroPaddingFactor) => void;
  setOpen: (open: boolean) => void;
  setColors: (colors: ViewColors) => void;
};

type State = SettingsState & SettingsActions;
export const useSettingsStore = create<State>()(
  subscribeWithSelector((set) => ({
    ...initialState,
    setFourierMode: (fourierMode) => set({ fourierMode }),
    setWindowFilter: (windowFilter) => set({ windowFilter }),
    setWindowSize: (windowSize) => set({ windowSize }),
    setMinFrequency: (minFrequency) => set({ minFrequency }),
    setMaxFrequency: (maxFrequency) => set({ maxFrequency }),
    setMinDecibel: (minDecibel) => set({ minDecibel }),
    setVisibleTimeBefore: (visibleTimeBefore) => set({ visibleTimeBefore }),
    setVisibleTimeAfter: (visibleTimeAfter) => set({ visibleTimeAfter }),
    setZeroPaddingFactor: (zeroPaddingFactor) => set({ zeroPaddingFactor }),
    setOpen: (open) => set({ open }),
    setColors: (colors) => set({ colors }),
  })),
);
