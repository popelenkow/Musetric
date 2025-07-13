import { useTheme } from '@mui/material';
import { waveform } from '@musetric/audio-view';
import { RefObject } from 'react';
import { useAsyncResource } from '../../../common/useAsyncResource';

export const useWaveformPipeline = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
) => {
  const theme = useTheme();

  const pipeline = useAsyncResource({
    create: () => {
      const canvas = canvasRef.current;
      if (!canvas) return undefined;

      const colors: waveform.Colors = {
        played: theme.palette.primary.main,
        unplayed: theme.palette.default.main,
      };

      return waveform.createPipeline(canvas, colors);
    },
    deps: [theme],
  });

  return pipeline;
};
