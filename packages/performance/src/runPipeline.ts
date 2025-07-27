import {
  spectrogram,
  isGpuFourierMode,
  FourierMode,
} from '@musetric/audio-view';
import {
  colors,
  minDecibel,
  runs,
  skipRuns,
  sampleRate,
  minFrequency,
  maxFrequency,
  windowFilter,
} from './constants';
import { waitNextFrame } from './waitNextFrame';

export const runPipeline = async (
  fourierMode: FourierMode,
  windowSize: number,
  wave: Float32Array,
  device: GPUDevice,
  canvas: HTMLCanvasElement,
): Promise<{
  first: Record<string, number>;
  average: Record<string, number>;
}> => {
  const metricsArray: Record<string, number>[] = [];
  const configureOptions: spectrogram.PipelineConfigureOptions = {
    windowSize,
    colors,
    sampleRate,
    minFrequency,
    maxFrequency,
    minDecibel,
    windowFilter,
  };
  const pipeline = isGpuFourierMode(fourierMode)
    ? spectrogram.gpu.createPipeline({
        device,
        canvas,
        fourierMode,
        onMetrics: (metrics) => metricsArray.push(metrics),
      })
    : spectrogram.cpu.createPipeline({
        canvas,
        fourierMode,
        onMetrics: (metrics) => metricsArray.push(metrics),
      });
  pipeline.configure(configureOptions);
  pipeline.resize({
    width: canvas.clientWidth,
    height: canvas.clientHeight,
  });

  for (let i = 0; i < skipRuns + runs; i++) {
    await pipeline.render(wave, 0);
    await waitNextFrame(15);
  }
  pipeline.destroy();

  const first = metricsArray[0] ?? {};
  const average: Record<string, number> = {};
  const keys = Object.keys(first);
  for (const key of keys) {
    let sum = 0;
    for (const metrics of metricsArray.slice(skipRuns)) {
      sum += metrics[key] ?? 0;
    }
    average[key] = sum / runs;
  }
  return { first, average };
};
