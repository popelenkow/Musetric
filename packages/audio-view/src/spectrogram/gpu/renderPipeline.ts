import { cpu, Parameters } from '..';
import { subComplexArray } from '../../common';
import { ComplexGpuBufferReader } from '../../common/gpuBufferReader';
import { GpuFourier } from '../../fourier/gpuFourier';
import { Drawer } from './drawer';

export type RenderPipelineOptions = {
  input: Float32Array;
  parameters: Parameters;
  windowSize: number;
  drawer: Drawer;
  arrays: cpu.PipelineArrays;
  fourier: GpuFourier;
  gpuBufferReader: ComplexGpuBufferReader;
};
export const renderPipeline = async (options: RenderPipelineOptions) => {
  const {
    input,
    parameters,
    windowSize,
    drawer,
    arrays,
    fourier,
    gpuBufferReader,
  } = options;
  const { width } = drawer;
  const { frequencies, magnitudes, waves } = arrays;
  const { progress } = parameters;

  cpu.fillWaves(windowSize, width, input, waves);
  const buffer = await fourier.forward(waves);

  await gpuBufferReader.read(buffer, frequencies);

  for (let x = 0; x < width; x++) {
    const start = x * windowSize;
    const end = start + windowSize;
    const frequency = subComplexArray(frequencies, start, end);
    const magnitude = magnitudes.subarray(start / 2, end / 2);
    cpu.normMagnitude(frequency, magnitude);
    cpu.normDecibel(magnitude);
  }
  await drawer.render(magnitudes, progress, parameters);
};
