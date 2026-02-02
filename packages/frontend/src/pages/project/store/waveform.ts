import { waveform, subscribeResizeObserver } from '@musetric/audio-view';
import { createSingletonManager } from '@musetric/resource-utils/singletonManager';
import { create } from 'zustand';
import { usePlayerStore } from './player.js';
import { useSettingsStore } from './settings.js';

export type WaveformState = {
  pipeline?: waveform.Pipeline;
};

type Unmount = () => void;
export type WaveformActions = {
  mount: (canvas: HTMLCanvasElement) => Unmount;
};

type State = WaveformState & WaveformActions;
export const useWaveformStore = create<State>((set, get) => {
  const render = () => {
    const { pipeline } = get();
    const { buffer, progress } = usePlayerStore.getState();
    if (!pipeline || !buffer) return;
    const data = buffer.getChannelData(0);
    pipeline.render(data, progress);
  };

  const singletonManager = createSingletonManager(
    async (canvas: HTMLCanvasElement) => {
      const { colors } = useSettingsStore.getState();
      const pipeline = waveform.createPipeline(canvas, colors);
      set({ pipeline });
      render();
      return Promise.resolve(pipeline);
    },
    async () => {
      set({ pipeline: undefined });
      return Promise.resolve();
    },
  );

  useSettingsStore.subscribe(
    (state) => state.colors,
    () => {
      render();
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
    mount: (canvas) => {
      void singletonManager.create(canvas);
      const unsubscribeResizeObserver = subscribeResizeObserver(
        canvas,
        async () => {
          render();
          return Promise.resolve();
        },
      );
      return () => {
        unsubscribeResizeObserver();
        void singletonManager.destroy();
      };
    },
  };
  return ref;
});
