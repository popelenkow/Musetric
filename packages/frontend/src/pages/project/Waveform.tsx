import { useTheme } from '@mui/material';
import { subscribeResizeObserver, waveform } from '@musetric/audio-view';
import { useQuery } from '@tanstack/react-query';
import { FC, useEffect, useRef } from 'react';
import { usePlayerStore } from './store';

export const Waveform: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buffer = usePlayerStore((s) => s.buffer);
  const progress = usePlayerStore((s) => s.progress);
  const seek = usePlayerStore((s) => s.seek);
  const theme = useTheme();

  const { data: pipeline } = useQuery({
    queryKey: ['waveform', theme],
    queryFn: () => {
      if (!canvasRef.current) return;
      return waveform.createPipeline(canvasRef.current, {
        played: theme.palette.primary.main,
        unplayed: theme.palette.default.main,
      });
    },
  });

  useEffect(() => {
    if (!canvasRef.current || !buffer || !pipeline) return;
    const data = buffer.getChannelData(0);
    pipeline.render(data, progress);
    return subscribeResizeObserver(canvasRef.current, async () => {
      await pipeline.render(data, progress);
    });
  }, [buffer, progress, pipeline]);

  return (
    <canvas
      ref={canvasRef}
      style={{ height: '100%', width: '100%', display: 'block' }}
      onClick={async (event) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        await seek(x / canvas.clientWidth);
      }}
    />
  );
};
