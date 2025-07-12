import { subscribeResizeObserver } from '@musetric/audio-view';
import { FC, useEffect, useRef } from 'react';
import { useWaveformPipeline } from './common/waveformPipeline';
import { usePlayerStore } from './store';

export const Waveform: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buffer = usePlayerStore((s) => s.buffer);
  const progress = usePlayerStore((s) => s.progress);
  const seek = usePlayerStore((s) => s.seek);

  const pipeline = useWaveformPipeline(canvasRef);

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
