import type { FourierMode } from '@musetric/audio-view';
import { create } from 'zustand';

export type SettingsState = {
  open: boolean;
  fourierMode: FourierMode;
  windowSize: number;
  minFrequency: number;
  maxFrequency: number;
  minDecibel: number;
};

const initialState: SettingsState = {
  open: false,
  fourierMode: 'gpuFftRadix4',
  windowSize: 1024 * 16,
  minFrequency: 120,
  maxFrequency: 5000,
  minDecibel: -45,
};

export type SettingsActions = {
  setOpen: (open: boolean) => void;
  setFourierMode: (mode: FourierMode) => void;
  setWindowSize: (size: number) => void;
  setMinFrequency: (value: number) => void;
  setMaxFrequency: (value: number) => void;
  setMinDecibel: (value: number) => void;
};

type State = SettingsState & SettingsActions;
export const useSettingsStore = create<State>((set) => ({
  ...initialState,
  setOpen: (open) => set({ open }),
  setFourierMode: (fourierMode) => set({ fourierMode }),
  setWindowSize: (windowSize) => set({ windowSize }),
  setMinFrequency: (minFrequency) => set({ minFrequency }),
  setMaxFrequency: (maxFrequency) => set({ maxFrequency }),
  setMinDecibel: (minDecibel) => set({ minDecibel }),
}));
