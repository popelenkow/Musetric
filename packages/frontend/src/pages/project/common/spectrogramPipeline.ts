import { useTheme } from '@mui/material';
import {
  FourierMode,
  isGpuFourierMode,
  spectrogram,
} from '@musetric/audio-view';
import { useQuery } from '@tanstack/react-query';
import { RefObject } from 'react';
import { getGpuDevice } from '../../../common/gpu';

export const useSpectrogramPipeline = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  windowSize: number,
  fourierMode: FourierMode,
) => {
  const theme = useTheme();

  const query = useQuery({
    queryKey: ['spectrogramPipeline', windowSize, fourierMode],
    queryFn: async () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return undefined;
      }
      const colors: spectrogram.Colors = {
        played: theme.palette.primary.main,
        unplayed: theme.palette.default.main,
        background: theme.palette.background.default,
      };
      if (isGpuFourierMode(fourierMode)) {
        const device = await getGpuDevice();
        return spectrogram.gpu.createPipeline({
          canvas,
          windowSize,
          fourierMode,
          colors,
          device,
        });
      }
      return spectrogram.cpu.createPipeline({
        canvas,
        windowSize,
        fourierMode,
        colors,
      });
    },
  });
  return query.data;
};
