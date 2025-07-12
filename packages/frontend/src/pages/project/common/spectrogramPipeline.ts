import { useTheme } from '@mui/material';
import {
  FourierMode,
  isGpuFourierMode,
  spectrogram,
} from '@musetric/audio-view';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefObject, useEffect, useMemo, useRef } from 'react';
import { getGpuDevice } from '../../../common/gpu';

export const createSpectrogramPipeline = async (
  canvas: HTMLCanvasElement,
  windowSize: number,
  fourierMode: FourierMode,
  colors: spectrogram.Colors,
): Promise<spectrogram.Pipeline> => {
  if (isGpuFourierMode(fourierMode)) {
    const device = await getGpuDevice();
    return await spectrogram.gpu.createPipeline({
      canvas,
      windowSize,
      fourierMode,
      colors,
      device,
    });
  }

  return await spectrogram.cpu.createPipeline({
    canvas,
    windowSize,
    fourierMode,
    colors,
  });
};

export const useSpectrogramPipeline = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  windowSize: number,
  fourierMode: FourierMode,
) => {
  const theme = useTheme();
  const pipelineRef = useRef<spectrogram.Pipeline>(undefined);
  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => ['spectrogramPipeline', windowSize, fourierMode],
    [windowSize, fourierMode],
  );

  useEffect(() => {
    return () => {
      pipelineRef.current?.destroy();
      pipelineRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey });
    };
  }, [queryClient, queryKey]);

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      pipelineRef.current?.destroy();
      pipelineRef.current = undefined;

      const canvas = canvasRef.current;
      if (!canvas) return undefined;

      const colors: spectrogram.Colors = {
        played: theme.palette.primary.main,
        unplayed: theme.palette.default.main,
        background: theme.palette.background.default,
      };

      const pipeline = await createSpectrogramPipeline(
        canvas,
        windowSize,
        fourierMode,
        colors,
      );

      pipelineRef.current = pipeline;
      return pipeline;
    },
  });

  return query.data;
};
