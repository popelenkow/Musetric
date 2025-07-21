import { useEffect, useRef, FC } from 'react';
import { MetricsData, runBenchmark } from '../runBenchmarks';
import { canvasWidth, canvasHeight } from '../constants';
import { FourierMode } from '@musetric/audio-view';

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

  const style = {
    width: '100%',
    height: 'auto',
    display: 'block',
    background: '#000',
  } as const;

  return (
    <canvas
      ref={canvasRef}
      key={`${fourierMode}-${windowSize}`}
      width={canvasWidth}
      height={canvasHeight}
      style={style}
    />
  );
};
