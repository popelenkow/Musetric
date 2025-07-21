import { createGpuContext, type FourierMode } from '@musetric/audio-view';
import { sampleRate } from './constants';
import { runPipeline } from './runPipeline';
import { waitNextFrame } from './waitNextFrame';

export type MetricsData = {
  first: Record<string, number>;
  average: Record<string, number>;
};

export type BenchmarkData = Record<FourierMode, Record<number, MetricsData>>;

export const runBenchmark = async (
  canvas: HTMLCanvasElement,
  mode: FourierMode,
  windowSize: number,
) => {
  const { device } = await createGpuContext(true);
  const length = sampleRate;
  const wave = new Float32Array(length);
  for (let i = 0; i < length; i++) wave[i] = Math.random() * 2 - 1;

  const metrics = await runPipeline(mode, windowSize, wave, device, canvas);
  await waitNextFrame(15);
  return metrics;
};
