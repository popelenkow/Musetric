import { FourierMode } from '@musetric/audio-view';
import { useEffect, useRef, FC } from 'react';
import { canvasWidth, canvasHeight } from '../constants';
import { MetricsData, runBenchmark } from '../runBenchmarks';

export type BenchmarkRunnerProps = {
  fourierMode: FourierMode;
  windowSize: number;
  onUpdate: (data: MetricsData) => void;
};
export const BenchmarkRunner: FC<BenchmarkRunnerProps> = (props) => {
  const { onUpdate, fourierMode, windowSize } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRendering = useRef(false);

  useEffect(() => {
    if (isRendering.current) return;
    isRendering.current = true;

    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    const run = async () => {
      const metrics = await runBenchmark(canvas, fourierMode, windowSize);
      onUpdate(metrics);
      isRendering.current = false;
    };
    void run();
  }, [onUpdate, fourierMode, windowSize]);

  return (
    <canvas
      ref={canvasRef}
      key={`${fourierMode}-${windowSize}`}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};
