import { createGpuContext, type FourierMode } from '@musetric/audio-view';
import { runPipeline } from './runPipeline';
import { waitNextFrame } from './waitNextFrame';

export type MetricsData = {
  first: Record<string, number>;
  average: Record<string, number>;
  maxDeviation: Record<string, { positive: number; negative: number }>;
};

export type BenchmarkData = Record<FourierMode, Record<number, MetricsData>>;

export const runBenchmark = async (
  canvas: HTMLCanvasElement,
  mode: FourierMode,
  windowSize: number,
) => {
  const { device } = await createGpuContext(true);

  const metrics = await runPipeline(mode, windowSize, device, canvas);
  await waitNextFrame(15);
  return metrics;
};
