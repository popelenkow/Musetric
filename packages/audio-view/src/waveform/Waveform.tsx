import { FC, useEffect, useRef } from 'react';
import { subscribeResizeObserver } from '../common';
import { createDrawer, generateSegments, Colors } from './common';

export type WaveformProps = {
  buffer: Float32Array;
  progress: number;
  onSeek: (fraction: number) => void;
  colors: Colors;
};
export const Waveform: FC<WaveformProps> = (props) => {
  const { buffer, progress, onSeek, colors } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const drawer = createDrawer(canvas);
    return subscribeResizeObserver(canvas, async () => {
      const segments = generateSegments(buffer, canvas.clientWidth);
      drawer.render(segments, progress, colors);
    });
  }, [buffer, progress, colors]);

  return (
    <canvas
      ref={canvasRef}
      style={{ height: '100%', width: '100%', display: 'block' }}
      onClick={(event) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        onSeek(x / canvas.clientWidth);
      }}
    />
  );
};
