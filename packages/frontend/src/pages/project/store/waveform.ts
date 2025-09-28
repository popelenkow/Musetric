import { waveform, subscribeResizeObserver } from '@musetric/audio-view';
import { createCallLatest } from '@musetric/resource-utils/callLatest';
import { create } from 'zustand';
import { usePlayerStore } from './player.js';
import { useSettingsStore } from './settings.js';

export type WaveformState = {
  pipeline?: waveform.Pipeline;
};

export const initialState: WaveformState = {};

export type WaveformActions = {
  mount: (canvas: HTMLCanvasElement) => void;
  unmount: () => void;
};

type State = WaveformState & WaveformActions;
export const useWaveformStore = create<State>((set, get) => {
  let canvas: HTMLCanvasElement | undefined = undefined;
  let unsubscribeResizeObserver: (() => void) | undefined = undefined;

  const createPipeline = () => {
    unsubscribeResizeObserver?.();
    unsubscribeResizeObserver = undefined;
    set({ pipeline: undefined });
    if (!canvas) return undefined;
    const { colors } = useSettingsStore.getState();
    return waveform.createPipeline(canvas, colors);
  };

  const mount = createCallLatest(async () => {
    const pipeline = createPipeline();
    set({ pipeline });
    return Promise.resolve();
  });

  const render = () => {
    const { pipeline } = get();
    const { buffer, progress } = usePlayerStore.getState();
    if (!pipeline || !buffer) return;
    const data = buffer.getChannelData(0);
    pipeline.render(data, progress);
  };

  useSettingsStore.subscribe(
    (state) => state.colors,
    () => {
      void render();
    },
  );

  usePlayerStore.subscribe(
    (state) => state,
    () => {
      void render();
    },
    {
      equalityFn: (a, b) => a.buffer === b.buffer && a.progress === b.progress,
    },
  );

  const ref: State = {
    ...initialState,
    mount: async (newCanvas) => {
      canvas = newCanvas;
      await mount();
      unsubscribeResizeObserver = subscribeResizeObserver(
        newCanvas,
        async () => {
          render();
          return Promise.resolve();
        },
      );
      render();
    },
    unmount: async () => {
      canvas = undefined;
      await mount();
    },
  };
  return ref;
});
