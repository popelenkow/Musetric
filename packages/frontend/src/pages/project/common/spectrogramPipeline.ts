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

export const useSpectrogramPipeline = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  windowSize: number,
  fourierMode: FourierMode,
) => {
  const theme = useTheme();

  const pipeline = useAsyncResource({
    create: async () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const colors: spectrogram.Colors = {
        played: theme.palette.primary.main,
        unplayed: theme.palette.default.main,
        background: theme.palette.background.default,
      };

      if (isGpuFourierMode(fourierMode)) {
        const device = await getGpuDevice(profiling);
        return await spectrogram.gpu.createPipeline({
          device,
          windowSize,
          fourierMode,
          canvas,
          colors,
          profiling,
        });
      }

      return await spectrogram.cpu.createPipeline({
        windowSize,
        fourierMode,
        canvas,
        colors,
      });
    },
    unmount: async (prev) => {
      prev.destroy();
    },
    deps: [windowSize, fourierMode, theme],
  });

  return pipeline;
};
