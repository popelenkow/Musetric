import { FC, useEffect, useRef } from 'react';
import { subscribeResizeObserver } from '../common';
import { FourierMode, isGpuFourierMode } from '../fourier';
import { Parameters, Gradients } from './common';
import { cpu } from './cpu';
import { gpu } from './gpu';

export type SpectrogramProps = {
  buffer: Float32Array;
  parameters: Parameters;
  progress: number;
  onSeek?: (fraction: number) => void;
  gradients: Gradients;
  fourierMode: FourierMode;
};
export const Spectrogram: FC<SpectrogramProps> = (props) => {
  const { buffer, parameters, progress, onSeek, gradients, fourierMode } =
    props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    return subscribeResizeObserver(canvas, async () => {
      if (isGpuFourierMode(fourierMode)) {
        const pipeline = await gpu.createPipeline(
          canvas,
          parameters,
          fourierMode,
        );
        await pipeline.render(buffer, progress, gradients);
        return;
      }
      const pipeline = await cpu.createPipeline(
        canvas,
        parameters,
        fourierMode,
      );
      await pipeline.render(buffer, progress, gradients);
    });
  }, [buffer, parameters, progress, gradients, fourierMode]);

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
