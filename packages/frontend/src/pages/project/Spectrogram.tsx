import {
  FourierMode,
  spectrogram,
  subscribeResizeObserver,
} from '@musetric/audio-view';
import { FC, useEffect, useRef } from 'react';
import { useSpectrogramPipeline } from './common/spectrogramPipeline';
import { usePlayerStore } from './store';

const windowSize = 1024 * 16;
export const fourierMode: FourierMode = 'gpuFftRadix4';

export const Spectrogram: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buffer = usePlayerStore((s) => s.buffer);
  const seek = usePlayerStore((s) => s.seek);
  const progress = usePlayerStore((s) => s.progress);

  const pipeline = useSpectrogramPipeline(canvasRef, windowSize, fourierMode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pipeline || !buffer) return;
    const parameters: spectrogram.Parameters = {
      sampleRate: buffer.sampleRate,
      minFrequency: buffer.sampleRate * 0.001,
      maxFrequency: buffer.sampleRate * 0.1,
      progress,
    };
    const data = buffer.getChannelData(0);
    void pipeline.render(data, parameters);
    return subscribeResizeObserver(canvas, async () => {
      pipeline.resize();
      await pipeline.render(data, parameters);
    });
  }, [pipeline, buffer, progress]);

  return (
    <canvas
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
