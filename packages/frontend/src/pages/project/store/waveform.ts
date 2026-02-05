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
  render: (wave: Float32Array<ArrayBuffer>) => void;
};

type State = WaveformState & WaveformActions;
export const useWaveformStore = create<State>((set, get) => {
  let waveData: Float32Array<ArrayBuffer> | undefined = undefined;

  const render = (wave?: Float32Array<ArrayBuffer>) => {
    if (wave) {
      waveData = wave;
    }
    const { pipeline } = get();
    if (!pipeline || !waveData) return;
    const { progress } = usePlayerStore.getState();
    pipeline.render(waveData, progress);
  };

  const singletonManager = createSingletonManager(
    async (canvas: HTMLCanvasElement) => {
      const { colors } = useSettingsStore.getState();
      const pipeline = waveform.createPipeline(canvas, colors);
      set({ pipeline });
      render();
      return pipeline;
    },
    async () => {
      waveData = undefined;
      set({ pipeline: undefined });
      return Promise.resolve();
    },
  );

  useSettingsStore.subscribe(
    (state) => state.colors,
    () => {
      void render();
    },
  );

  usePlayerStore.subscribe(
    (state) => state.progress,
    () => {
      render();
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
    render: (wave) => {
      render(wave);
    },
  };
  return ref;
});
