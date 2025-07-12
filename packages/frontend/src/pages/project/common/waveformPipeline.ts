import { useTheme } from '@mui/material';
import { waveform } from '@musetric/audio-view';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefObject, useEffect, useMemo, useRef } from 'react';

export const createWaveformPipeline = (
  canvas: HTMLCanvasElement,
  colors: waveform.Colors,
): waveform.Pipeline => {
  return waveform.createPipeline(canvas, colors);
};

export const useWaveformPipeline = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
) => {
  const theme = useTheme();
  const pipelineRef = useRef<waveform.Pipeline>(undefined);
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['waveformPipeline'], []);

  useEffect(() => {
    return () => {
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
    queryFn: () => {
      pipelineRef.current = undefined;

      const canvas = canvasRef.current;
      if (!canvas) return undefined;

      const colors: waveform.Colors = {
        played: theme.palette.primary.main,
        unplayed: theme.palette.default.main,
      };

      const pipeline = createWaveformPipeline(canvas, colors);
      pipelineRef.current = pipeline;
      return pipeline;
    },
  });

  return query.data;
};
