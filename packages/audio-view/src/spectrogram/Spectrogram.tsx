import { FC, useEffect, useRef } from 'react';
import { subscribeResizeObserver } from '../common';
import { drawSpectrogram } from './common/drawSpectrogram';

export type SpectrogramProps = {
  buffer: Float32Array;
  windowSize: number;
  cutoffRatio?: number;
};
export const Spectrogram: FC<SpectrogramProps> = (props) => {
  const { buffer, windowSize, cutoffRatio = 1 } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return subscribeResizeObserver(canvas, () => {
      drawSpectrogram(canvas, buffer, windowSize, cutoffRatio);
    });
  }, [buffer, windowSize, cutoffRatio]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
};
