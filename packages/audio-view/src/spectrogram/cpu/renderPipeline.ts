import { Parameters } from '..';
import { subComplexArray } from '../../common';
import { CpuFourier } from '../../fourier/cpuFourier';
import { Drawer } from './drawer';
import { fillWaves } from './fillWaves';
import { normalizeDecibel } from './normalizeDecibel';
import { normalizeMagnitude } from './normalizeMagnitude';
import { PipelineArrays } from './pipelineArrays';

export type RenderPipelineOptions = {
  input: Float32Array;
  parameters: Parameters;
  windowSize: number;
  drawer: Drawer;
  arrays: PipelineArrays;
  fourier: CpuFourier;
};
export const renderPipeline = async (options: RenderPipelineOptions) => {
  const { input, parameters, windowSize, drawer, arrays, fourier } = options;
  const { width } = drawer;
  const { frequencies, magnitudes, waves } = arrays;
  const { progress } = parameters;

  fillWaves(windowSize, width, input, waves);
  await fourier.forward(waves, frequencies);

  for (let x = 0; x < width; x++) {
    const start = x * windowSize;
    const end = start + windowSize;
    const frequency = subComplexArray(frequencies, start, end);
    const magnitude = magnitudes.subarray(start / 2, end / 2);
    normalizeMagnitude(frequency, magnitude);
    normalizeDecibel(magnitude);
  }
  drawer.render(magnitudes, progress, parameters);
};
