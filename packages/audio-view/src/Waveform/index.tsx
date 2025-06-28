import { FC, useEffect, useRef } from 'react';
import { WaveSegment, generateSegments, drawWaveform } from './common';

export type WaveformProps = {
  buffer?: Float32Array;
  progress: number;
  onSeek: (fraction: number) => void;
  playedColor: string;
  unplayedColor: string;
};
export const Waveform: FC<WaveformProps> = (props) => {
  const { buffer, progress, onSeek, playedColor, unplayedColor } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const segmentsRef = useRef<WaveSegment[]>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !buffer) return;
    segmentsRef.current = generateSegments(buffer, canvas.clientWidth);
    drawWaveform(canvas, segmentsRef.current, progress, {
      played: playedColor,
      unplayed: unplayedColor,
    });
  }, [buffer, playedColor, unplayedColor, progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !segmentsRef.current) return;
    drawWaveform(canvas, segmentsRef.current, progress, {
      played: playedColor,
      unplayed: unplayedColor,
    });
  }, [progress, playedColor, unplayedColor]);

  return (
    <canvas
      ref={canvasRef}
      height={80}
      style={{ width: '100%', height: 80, display: 'block' }}
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
