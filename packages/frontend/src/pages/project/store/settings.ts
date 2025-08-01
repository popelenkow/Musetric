import type {
  FourierMode,
  spectrogram,
  ViewColors,
} from '@musetric/audio-view';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type SettingsState = {
  fourierMode: FourierMode;
  windowFilter: spectrogram.WindowFilterKey;
  windowSize: number;
  minFrequency: number;
  maxFrequency: number;
  minDecibel: number;
  visibleTimeBefore: number;
  visibleTimeAfter: number;
  zeroPaddingFactor: spectrogram.ZeroPaddingFactor;
  open: boolean;
  colors: ViewColors;
};

const initialState: SettingsState = {
  fourierMode: 'gpuFftRadix4',
  windowFilter: 'hamming',
  windowSize: 1024 * 4,
  minFrequency: 120,
  maxFrequency: 4000,
  minDecibel: -40,
  visibleTimeBefore: 2.0,
  visibleTimeAfter: 2.0,
  zeroPaddingFactor: 2,
  open: false,
  colors: {
    background: '#000000',
    played: '#ffffff',
    unplayed: '#888888',
  },
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
