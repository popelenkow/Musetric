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
  const profiles: Record<string, number>[] = [];
  const configureOptions: spectrogram.PipelineConfigureOptions = {
    windowSize,
    colors,
    sampleRate,
    minFrequency,
    maxFrequency,
    minDecibel,
  };
  const pipeline = isGpuFourierMode(fourierMode)
    ? spectrogram.gpu.createPipeline({
        device,
        canvas,
        fourierMode,
        onProfile: (profile) => profiles.push(profile),
        ...configureOptions,
      })
    : spectrogram.cpu.createPipeline({
        canvas,
        fourierMode,
        onProfile: (profile) => profiles.push(profile),
        ...configureOptions,
      });

  for (let i = 0; i < skipRuns + runs; i++) {
    await pipeline.render(wave, 0);
    await waitNextFrame(15);
  }
  pipeline.destroy();

  const first = profiles[0] ?? {};
  const average: Record<string, number> = {};
  const keys = Object.keys(first);
  for (const key of keys) {
    let sum = 0;
    for (const profile of profiles.slice(skipRuns)) {
      sum += profile[key] ?? 0;
    }
    average[key] = sum / runs;
  }
  return { first, average };
};
