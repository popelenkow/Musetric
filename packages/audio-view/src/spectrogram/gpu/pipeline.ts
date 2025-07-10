import { Colors, Pipeline, PipelineRender, cpu } from '..';
import { createCallLatest } from '../../common';
import { GpuFourierMode, gpuFouriers } from '../../fourier';
import { createDecibelNormalizer } from './decibelNormalizer';
import { createDrawer } from './drawer';
import { createMagnitudeNormalizer } from './magnitudeNormalizer';
import { createPipelineBuffers } from './pipelineBuffers';

export type CreatePipelineOptions = {
  canvas: HTMLCanvasElement;
  windowSize: number;
  fourierMode: GpuFourierMode;
  colors: Colors;
  device: GPUDevice;
};
export type CreatePipeline = (
  options: CreatePipelineOptions,
) => Promise<Pipeline>;

export const createPipeline: CreatePipeline = async (options) => {
  const { canvas, windowSize, fourierMode, colors, device } = options;

  const drawer = createDrawer(canvas, colors, windowSize, device);
  let arrays = cpu.createPipelineArrays(windowSize, drawer.width);
  const createFourier = gpuFouriers[fourierMode];
  const fourier = await createFourier({
    windowSize,
    windowCount: drawer.width,
    device,
  });
  const buffers = createPipelineBuffers(device, windowSize, drawer.width);
  const magnitudeNormalizer = createMagnitudeNormalizer(device, windowSize);
  const decibelNormalizer = createDecibelNormalizer(device, windowSize);

  let isResizeRequested = false;

  const resize = () => {
    isResizeRequested = false;
    drawer.resize();
    arrays = cpu.createPipelineArrays(windowSize, drawer.width);
    fourier.resize(drawer.width);
    buffers.resize(drawer.width);
  };

  return {
    resize: () => {
      isResizeRequested = true;
    },
    render: createCallLatest<PipelineRender>(async (input, parameters) => {
      if (isResizeRequested) {
        resize();
      }
      const { width } = drawer;
      const { waves } = arrays;

      cpu.fillWaves(windowSize, width, input, waves);
      const encoder = device.createCommandEncoder({ label: 'render-pipeline' });
      const buffer = fourier.forward(encoder, waves);
      magnitudeNormalizer.run(encoder, buffer, buffers.magnitude, width);
      decibelNormalizer.run(encoder, buffers.magnitude, width);
      drawer.render(encoder, buffers.magnitude, parameters);
      device.queue.submit([encoder.finish()]);
      await device.queue.onSubmittedWorkDone();
    }),
  };
};
