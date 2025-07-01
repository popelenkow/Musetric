import { FC, useEffect, useMemo, useRef } from 'react';
import { subscribeResizeObserver } from '../common';
import {
  SpectrogramColors,
  parseHexColor,
  createGradient,
  SpectrogramParameters,
  SpectrogramGradients,
} from './common';
import { drawSpectrogram } from './common/drawSpectrogram';

export type SpectrogramProps = {
  buffer: Float32Array;
  parameters: SpectrogramParameters;
  progress: number;
  colors: SpectrogramColors;
  onSeek?: (fraction: number) => void;
};
export const Spectrogram: FC<SpectrogramProps> = (props) => {
  const { buffer, parameters, progress, colors, onSeek } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const gradients: SpectrogramGradients = useMemo(
    () => ({
      played: createGradient(
        parseHexColor(colors.background),
        parseHexColor(colors.played),
      ),
      unplayed: createGradient(
        parseHexColor(colors.background),
        parseHexColor(colors.unplayed),
      ),
    }),
    [colors],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return subscribeResizeObserver(canvas, () => {
      drawSpectrogram(canvas, buffer, parameters, progress, gradients);
    });
  }, [buffer, parameters, progress, gradients]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
      onClick={(event) => {
        if (!onSeek) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        onSeek(x / canvas.clientWidth);
      }}
    />
  );
};
