import { subscribeResizeObserver, waveform } from '@musetric/audio-view';
import { createSingletonManager } from '@musetric/resource-utils/singletonManager';
import { create } from 'zustand';
import { usePlayerStore } from './player.js';
import { useSettingsStore } from './settings.js';

export type WaveformState = {
  wave?: Float32Array<ArrayBuffer>;
  pipeline?: waveform.Pipeline;
};

type Unmount = () => void;
export type WaveformActions = {
  mount: (
    canvas: HTMLCanvasElement,
    wave: Float32Array<ArrayBuffer>,
  ) => Unmount;
};

type State = WaveformState & WaveformActions;
export const useWaveformStore = create<State>((set, get) => {
  const render = () => {
    const { wave, pipeline } = get();
    const { progress } = usePlayerStore.getState();
    if (!pipeline || !wave) return;
    pipeline.render(wave, progress);
  };

  const singletonManager = createSingletonManager(
    async (canvas: HTMLCanvasElement, wave: Float32Array<ArrayBuffer>) => {
      const { colors } = useSettingsStore.getState();
      const pipeline = waveform.createPipeline(canvas, colors);
      set({ wave, pipeline });
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
      equalityFn: (a, b) => a.progress === b.progress,
    },
  );

  const ref: State = {
    mount: (canvas, wave) => {
      void singletonManager.create(canvas, wave);
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
