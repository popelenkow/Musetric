import type { ComplexArray, CpuFourierMode } from '../../fourier';
import { cpuFouriers, normComplexArray } from '../../fourier';
import { Colors } from '../colors';
import { Pipeline, PipelineRender } from '../pipeline';
import { createDrawer } from './drawer';
import { normDecibel } from './normDecibel';
import { createPipelineBuffers } from './pipelineBuffers';
import { fillWave, computeColumn } from './utils';

export type CreatePipelineOptions = {
  canvas: HTMLCanvasElement;
  windowSize: number;
  fourierMode: CpuFourierMode;
  colors: Colors;
};
export const createPipeline = async (
  options: CreatePipelineOptions,
): Promise<Pipeline> => {
  const { canvas, windowSize, fourierMode, colors } = options;

  const createFourier = cpuFouriers[fourierMode];
  const fourier = await createFourier(windowSize);
  const drawer = createDrawer(canvas, colors);
  let buffers = createPipelineBuffers(windowSize, drawer.width);

  const resize = () => {
    drawer.resize();
    buffers = createPipelineBuffers(windowSize, drawer.width);
  };

  const render: PipelineRender = async (input, parameters) => {
    const { width, height, columns } = drawer;
    const { frequency, magnitude, wave } = buffers;

    fillWave(windowSize, width, input, wave);
    await fourier.forward(wave, frequency);

    for (let x = 0; x < width; x++) {
      const slice: ComplexArray = {
        real: frequency.real.subarray(x * windowSize, (x + 1) * windowSize),
        imag: frequency.imag.subarray(x * windowSize, (x + 1) * windowSize),
      };
      normComplexArray(slice, magnitude);
      normDecibel(magnitude);
      computeColumn(windowSize, height, parameters, magnitude, columns[x]);
    }
    const { progress } = parameters;
    drawer.render(progress);
  };

  return { resize, render };
};
