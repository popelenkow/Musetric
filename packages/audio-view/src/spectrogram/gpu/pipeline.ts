import { Colors, Pipeline, PipelineRender, cpu } from '..';
import { createCallLatest } from '../../common';
import { GpuFourierMode, gpuFouriers } from '../../fourier';
import { createDecibelNormalizer } from './decibelNormalizer';
import { createDrawer } from './drawer';
import { createLogSlicer } from './logSlicer';
import { createMagnitudeNormalizer } from './magnitudeNormalizer';
import { createPipelineBuffers } from './pipelineBuffers';

export type CreatePipelineOptions = {
  device: GPUDevice;
  windowSize: number;
  fourierMode: GpuFourierMode;
  canvas: HTMLCanvasElement;
  colors: Colors;
};
export type CreatePipeline = (
  options: CreatePipelineOptions,
) => Promise<Pipeline>;

export const createPipeline: CreatePipeline = async (options) => {
  const { device, windowSize, fourierMode, canvas, colors } = options;

  const drawer = createDrawer(device, canvas, colors);
  let windowCount = drawer.width;

  let arrays = cpu.createPipelineArrays(windowSize, windowCount);
  const buffers = createPipelineBuffers(device, windowSize, windowCount);

  const createFourier = gpuFouriers[fourierMode];
  const fourier = await createFourier({
    device,
    windowSize,
    windowCount,
  });
  const magnitudeNormalizer = createMagnitudeNormalizer(device, windowSize);
  const decibelNormalizer = createDecibelNormalizer(device, windowSize);
  const logSlicer = createLogSlicer(device, windowSize);

  let isResizeRequested = false;

  const resize = () => {
    isResizeRequested = false;
    drawer.resize();
    windowCount = drawer.width;
    arrays = cpu.createPipelineArrays(windowSize, windowCount);
    fourier.resize(windowCount);
    buffers.resize(windowCount);
  };

  return {
    resize: () => {
      isResizeRequested = true;
    },
    render: createCallLatest<PipelineRender>(async (input, parameters) => {
      if (isResizeRequested) {
        resize();
      }
      cpu.fillWaves(windowSize, windowCount, input, arrays.waves);
      const encoder = device.createCommandEncoder({ label: 'render-pipeline' });
      const buffer = fourier.forward(encoder, arrays.waves);
      magnitudeNormalizer.run(encoder, buffer, buffers.magnitude, windowCount);
      decibelNormalizer.run(encoder, buffers.magnitude, windowCount);
      logSlicer.run(encoder, buffers.magnitude, parameters, drawer);
      drawer.render(encoder, parameters);
      device.queue.submit([encoder.finish()]);
      await device.queue.onSubmittedWorkDone();
    }),
    destroy: () => {
      drawer.destroy();
      fourier.destroy();
      buffers.destroy();
      magnitudeNormalizer.destroy();
      decibelNormalizer.destroy();
    },
  };
};
