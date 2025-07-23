import { useTheme } from '@mui/material';
import { isGpuFourierMode, spectrogram } from '@musetric/audio-view';
import { RefObject } from 'react';
import { envs } from '../../../common/envs';
import { getGpuDevice } from '../../../common/gpu';
import { useAsyncResource } from '../../../common/useAsyncResource';
import { useSettingsStore } from '../store/settings';

const profiling = envs.spectrogramProfiling;

export const useSpectrogramPipeline = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  buffer?: AudioBuffer,
) => {
  const theme = useTheme();

  const windowSize = useSettingsStore((s) => s.windowSize);
  const fourierMode = useSettingsStore((s) => s.fourierMode);
  const minFrequency = useSettingsStore((s) => s.minFrequency);
  const maxFrequency = useSettingsStore((s) => s.maxFrequency);
  const minDecibel = useSettingsStore((s) => s.minDecibel);

  const pipeline = useAsyncResource({
    create: async () => {
      const canvas = canvasRef.current;
      if (!canvas || !buffer) {
        return;
      }

      const { sampleRate } = buffer;
      const colors: spectrogram.Colors = {
        played: theme.palette.primary.main,
        unplayed: theme.palette.default.main,
        background: theme.palette.background.default,
      };
      const configureOptions: spectrogram.PipelineConfigureOptions = {
        windowSize,
        colors,
        sampleRate,
        minFrequency,
        maxFrequency,
        minDecibel,
      };

      if (isGpuFourierMode(fourierMode)) {
        const device = await getGpuDevice(profiling);
        return spectrogram.gpu.createPipeline({
          device,
          fourierMode,
          canvas,
          onProfile: profiling
            ? (profile) => {
                console.table(profile);
              }
            : undefined,
          ...configureOptions,
        });
      }

      return spectrogram.cpu.createPipeline({
        fourierMode,
        canvas,
        onProfile: profiling
          ? (profile) => {
              console.table(profile);
            }
          : undefined,
        ...configureOptions,
      });
    },
    unmount: async (prev) => {
      prev.destroy();
    },
    deps: [
      windowSize,
      fourierMode,
      minFrequency,
      maxFrequency,
      minDecibel,
      buffer,
      theme,
    ],
  });

  return pipeline;
};
