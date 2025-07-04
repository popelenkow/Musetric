import { Colors, cpu, Pipeline, PipelineRender } from '../';
import {
  ComplexArray,
  GpuFourierMode,
  gpuFouriers,
  normComplexArray,
} from '../../fourier';

export type CreatePipelineOptions = {
  canvas: HTMLCanvasElement;
  windowSize: number;
  fourierMode: GpuFourierMode;
  colors: Colors;
  device: GPUDevice;
};

export const createPipeline = async (
  options: CreatePipelineOptions,
): Promise<Pipeline> => {
  const { canvas, windowSize, fourierMode, colors, device } = options;

  const createFourier = gpuFouriers[fourierMode];
  const fourier = await createFourier(windowSize, device);
  const drawer = cpu.createDrawer(canvas, colors);

  let buffers = cpu.createPipelineBuffers(windowSize, drawer.width);

  const resize = () => {
    drawer.resize();
    buffers = cpu.createPipelineBuffers(windowSize, drawer.width);
  };

  const render: PipelineRender = async (input, parameters) => {
    const { width, height, columns } = drawer;
    const { frequency, magnitude, wave } = buffers;

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
    const { progress } = parameters;
    drawer.render(progress);
  };

  return { resize, render };
};
