import {
  isGpuFourierMode,
  resizeCanvas,
  spectrogram,
  subscribeResizeObserver,
  ViewSize,
} from '@musetric/audio-view';
import { createCallLatest } from '@musetric/resource-utils/callLatest';
import { create } from 'zustand';
import { envs } from '../../../common/envs';
import { getGpuDevice } from '../../../common/gpu';
import { usePlayerStore } from './player';
import { useSettingsStore } from './settings';

export type SpectrogramState = {
  pipeline?: spectrogram.Pipeline;
  viewSize?: ViewSize;
};

export const initialState: SpectrogramState = {};

export type SpectrogramActions = {
  mount: (canvas: HTMLCanvasElement) => void;
  unmount: () => void;
};

type State = SpectrogramState & SpectrogramActions;
export const useSpectrogramStore = create<State>((set, get) => {
  const profiling = envs.spectrogramProfiling;

  let canvas: HTMLCanvasElement | undefined = undefined;
  let unsubscribeResizeObserver: (() => void) | undefined = undefined;

  const createPipeline = async () => {
    const prevPipeline = get().pipeline;
    unsubscribeResizeObserver?.();
    unsubscribeResizeObserver = undefined;
    set({ pipeline: undefined });
    prevPipeline?.destroy();

    if (!canvas) return undefined;

    set({ viewSize: resizeCanvas(canvas) });
    const { fourierMode } = useSettingsStore.getState();

    if (isGpuFourierMode(fourierMode)) {
      const device = await getGpuDevice(profiling);
      return spectrogram.gpu.createPipeline({
        device,
        fourierMode,
        canvas,
        onMetrics: profiling
          ? (metrics) => {
              console.table(metrics);
            }
          : undefined,
      });
    }

    return spectrogram.cpu.createPipeline({
      fourierMode,
      canvas,
      onMetrics: profiling
        ? (metrics) => {
            console.table(metrics);
          }
        : undefined,
    });
  };

  const mount = createCallLatest(async () => {
    const pipeline = await createPipeline();
    set({ pipeline });
  });

  const configure = () => {
    const { pipeline, viewSize } = get();
    const { sampleRate } = usePlayerStore.getState();
    const settings = useSettingsStore.getState();
    if (!pipeline || !sampleRate || !viewSize) return;

    const config: spectrogram.PipelineConfig = {
      ...settings,
      viewSize,
      sampleRate,
    };
    pipeline.configure(config);
  };

  const render = async () => {
    const { pipeline } = get();
    const { buffer, progress } = usePlayerStore.getState();
    if (!pipeline || !buffer) return;
    const data = buffer.getChannelData(0);
    await pipeline.render(data, progress);
  };

  useSettingsStore.subscribe(
    (state) => state,
    () => {
      configure();
      void render();
    },
    {
      equalityFn: (a, b) => a.fourierMode !== b.fourierMode,
    },
  );

  usePlayerStore.subscribe(
    (state) => state.sampleRate,
    () => {
      configure();
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
          set({ viewSize: resizeCanvas(newCanvas) });
          configure();
          await render();
        },
      );
      configure();
      await render();
    },
    unmount: async () => {
      canvas = undefined;
      await mount();
    },
  };
  return ref;
});
