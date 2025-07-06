import { cpu, Parameters } from '..';
import { ComplexArray, Fourier, normComplexArray } from '../../fourier';

export type RenderPipelineOptions = {
  input: Float32Array;
  parameters: Parameters;
  windowSize: number;
  drawer: cpu.Drawer;
  buffers: cpu.PipelineBuffers;
  fourier: Fourier;
};
export const renderPipeline = async (options: RenderPipelineOptions) => {
  const { input, parameters, windowSize, drawer, buffers, fourier } = options;
  const { width, height, columns } = drawer;
  const { frequency, magnitude, wave } = buffers;
  const { progress } = parameters;

  cpu.fillWave(windowSize, width, input, wave);
  await fourier.forward(wave, frequency);

  for (let x = 0; x < width; x++) {
    const slice: ComplexArray = {
      real: frequency.real.subarray(x * windowSize, (x + 1) * windowSize),
      imag: frequency.imag.subarray(x * windowSize, (x + 1) * windowSize),
    };
    normComplexArray(slice, magnitude);
    cpu.normDecibel(magnitude);
    cpu.computeColumn(windowSize, height, parameters, magnitude, columns[x]);
  }
  drawer.render(progress);
};
