import {
  createCallLatest,
  FourierMode,
  isGpuFourierMode,
  spectrogram,
} from '@musetric/audio-view';
import { create } from 'zustand';
import { envs } from '../../../common/envs';
import { getGpuDevice } from '../../../common/gpu';

export type SpectrogramState = {
  pipeline?: spectrogram.Pipeline;
};

export const initialState: SpectrogramState = {
  pipeline: undefined,
};

export type SpectrogramActions = {
  mount: (canvas: HTMLCanvasElement, fourierMode: FourierMode) => void;
  unmount: () => void;
};

type State = SpectrogramState & SpectrogramActions;
export const useSpectrogramStore = create<State>((set, get) => {
  const profiling = envs.spectrogramProfiling;

  const run = createCallLatest(
    async (canvas?: HTMLCanvasElement, fourierMode?: FourierMode) => {
      const prevPipeline = get().pipeline;
      set({ pipeline: undefined });
      prevPipeline?.destroy();

      if (!canvas || !fourierMode) {
        return;
      }

      if (isGpuFourierMode(fourierMode)) {
        const device = await getGpuDevice(profiling);
        const pipeline = spectrogram.gpu.createPipeline({
          device,
          fourierMode,
          canvas,
          onMetrics: profiling
            ? (metrics) => {
                console.table(metrics);
              }
            : undefined,
        });
        set({ pipeline });
        return;
      }

      const pipeline = spectrogram.cpu.createPipeline({
        fourierMode,
        canvas,
        onMetrics: profiling
          ? (metrics) => {
              console.table(metrics);
            }
          : undefined,
      });
      set({ pipeline });
    },
  );

  const state: State = {
    ...initialState,
    mount: run,
    unmount: run,
  };

  return state;
});
