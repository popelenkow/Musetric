import { subscribeResizeObserver } from '@musetric/audio-view';
import { FC, useEffect, useRef } from 'react';
import { useSpectrogramPipeline } from './common/spectrogramPipeline';
import { usePlayerStore } from './store/player';
import { useSettingsStore } from './store/settings';

export const Spectrogram: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buffer = usePlayerStore((s) => s.buffer);
  const seek = usePlayerStore((s) => s.seek);
  const progress = usePlayerStore((s) => s.progress);
  const fourierMode = useSettingsStore((s) => s.fourierMode);

  const pipeline = useSpectrogramPipeline(canvasRef, buffer);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pipeline || !buffer) return;
    const data = buffer.getChannelData(0);
    void pipeline.render(data, progress);
    return subscribeResizeObserver(canvas, async () => {
      pipeline.resize();
      await pipeline.render(data, progress);
    });
  }, [pipeline, buffer, progress]);

  return (
    <canvas
      key={fourierMode}
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
      onClick={async (event) => {
        const canvas = event.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        await seek(x / canvas.clientWidth);
      }}
    />
  );
};
