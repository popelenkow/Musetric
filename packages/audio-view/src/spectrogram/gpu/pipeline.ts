import { Colors, Pipeline, PipelineRender, cpu } from '..';
import { createCallLatest } from '../../common';
import { createGpuTimer } from '../../common/gpuTimer';
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
  profiling?: boolean;
};
export type CreatePipeline = (
  options: CreatePipelineOptions,
) => Promise<Pipeline>;

export const createPipeline: CreatePipeline = async (options) => {
  const { device, windowSize, fourierMode, canvas, colors, profiling } =
    options;

  const timer = profiling
    ? createGpuTimer(device, [
        'fourierReverse',
        'fourierTransform',
        'magnitudeNormalizer',
        'decibelNormalizer',
        'logSlicer',
        'drawer',
      ])
    : undefined;

  const drawer = createDrawer({
    device,
    canvas,
    colors,
    timestampWrites: timer?.timestampWrites.drawer,
  });
  let windowCount = drawer.width;

  let arrays = cpu.createPipelineArrays(windowSize, windowCount);
  const buffers = createPipelineBuffers({ device, windowSize, windowCount });

  const createFourier = gpuFouriers[fourierMode];
  const fourier = await createFourier({
    device,
    windowSize,
    windowCount,
    timestampWrites: {
      reverse: timer?.timestampWrites.fourierReverse,
      transform: timer?.timestampWrites.fourierTransform,
    },
  });
  const magnitudeNormalizer = createMagnitudeNormalizer({
    device,
    windowSize,
    timestampWrites: timer?.timestampWrites.magnitudeNormalizer,
  });
  const decibelNormalizer = createDecibelNormalizer({
    device,
    windowSize,
    timestampWrites: timer?.timestampWrites.decibelNormalizer,
  });
  const logSlicer = createLogSlicer({
    device,
    windowSize,
    timestampWrites: timer?.timestampWrites.logSlicer,
  });

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
      timer?.resolve(encoder);
      device.queue.submit([encoder.finish()]);
      await device.queue.onSubmittedWorkDone();

      if (timer) {
        const duration = await timer.read();
        console.table(duration);
      }
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
