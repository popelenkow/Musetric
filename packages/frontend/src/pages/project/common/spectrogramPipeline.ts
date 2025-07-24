import { useTheme } from '@mui/material';
import {
  FourierMode,
  isGpuFourierMode,
  spectrogram,
} from '@musetric/audio-view';
import { RefObject } from 'react';
import { envs } from '../../../common/envs';
import { getGpuDevice } from '../../../common/gpu';
import { useAsyncResource } from '../../../common/useAsyncResource';

const profiling = envs.spectrogramProfiling;
const minDecibel = -45;

export const useSpectrogramPipeline = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  windowSize: number,
  fourierMode: FourierMode,
  buffer?: AudioBuffer,
) => {
  const theme = useTheme();

  const pipeline = useAsyncResource({
    create: async () => {
      const canvas = canvasRef.current;
      if (!canvas || !buffer) {
        return;
      }

      const colors: spectrogram.Colors = {
        played: theme.palette.primary.main,
        unplayed: theme.palette.default.main,
        background: theme.palette.background.default,
      };

      const viewParams: spectrogram.SignalViewParams = {
        sampleRate: buffer.sampleRate,
        minFrequency: 120,
        maxFrequency: 5000,
      };

      if (isGpuFourierMode(fourierMode)) {
        const device = await getGpuDevice(profiling);
        return spectrogram.gpu.createPipeline({
          device,
          windowSize,
          fourierMode,
          canvas,
          colors,
          viewParams,
          minDecibel,
          onProfile: profiling
            ? (profile) => {
                console.table(profile);
              }
            : undefined,
        });
      }

      return spectrogram.cpu.createPipeline({
        windowSize,
        fourierMode,
        canvas,
        colors,
        viewParams,
        minDecibel,
        onProfile: profiling
          ? (profile) => {
              console.table(profile);
            }
          : undefined,
      });
    },
    unmount: async (prev) => {
      prev.destroy();
    },
    deps: [windowSize, fourierMode, buffer, theme],
  });

  return pipeline;
};
