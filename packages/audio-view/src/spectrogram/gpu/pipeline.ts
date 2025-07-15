import { Colors, Parameters, Pipeline, PipelineRender } from '..';
import {
  createCallLatest,
  createComplexArray,
  createCpuTimer,
  createGpuTimer,
} from '../../common';
import { GpuFourierMode, gpuFouriers } from '../../fourier';
import { fillWaves as fillWavesImpl } from '../cpu';
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
    ? {
        gpu: createGpuTimer(device, [
          'fourierReverse',
          'fourierTransform',
          'magnitudeNormalizer',
          'decibelNormalizer',
          'logSlicer',
          'drawer',
        ]),
        cpu: createCpuTimer(['resize', 'fillWaves', 'fourierForward', 'total']),
      }
    : undefined;

  const drawer = createDrawer({
    device,
    canvas,
    colors,
    timestampWrites: timer?.gpu.timestampWrites.drawer,
  });
  let windowCount = drawer.width;

  let waves = createComplexArray(windowSize * windowCount);
  const buffers = createPipelineBuffers({ device, windowSize, windowCount });

  const createFourier = gpuFouriers[fourierMode];
  const fourier = await createFourier({
    device,
    windowSize,
    windowCount,
    timestampWrites: {
      reverse: timer?.gpu.timestampWrites.fourierReverse,
      transform: timer?.gpu.timestampWrites.fourierTransform,
    },
  });
  if (timer) {
    fourier.forward = timer?.cpu.wrap('fourierForward', fourier.forward);
  }
  const magnitudeNormalizer = createMagnitudeNormalizer({
    device,
    windowSize,
    timestampWrites: timer?.gpu.timestampWrites.magnitudeNormalizer,
  });
  const decibelNormalizer = createDecibelNormalizer({
    device,
    windowSize,
    timestampWrites: timer?.gpu.timestampWrites.decibelNormalizer,
  });
  const logSlicer = createLogSlicer({
    device,
    windowSize,
    timestampWrites: timer?.gpu.timestampWrites.logSlicer,
  });

  let isResizeRequested = false;

  const fillWaves =
    timer?.cpu.wrap('fillWaves', fillWavesImpl) ?? fillWavesImpl;

  const createCommand = (parameters: Parameters) => {
    const encoder = device.createCommandEncoder({ label: 'render-pipeline' });
    const buffer = fourier.forward(encoder, waves);
    magnitudeNormalizer.run(encoder, buffer, buffers.magnitude, windowCount);
    decibelNormalizer.run(encoder, buffers.magnitude, windowCount);
    logSlicer.run(encoder, buffers.magnitude, parameters, drawer);
    drawer.render(encoder, parameters);
    timer?.gpu.resolve(encoder);
    return encoder.finish();
  };

  const resizeImpl = () => {
    isResizeRequested = false;
    drawer.resize();
    windowCount = drawer.width;
    waves = createComplexArray(windowSize * windowCount);
    fourier.resize(windowCount);
    buffers.resize(windowCount);
  };
  const resize = timer?.cpu.wrap('resize', resizeImpl) ?? resizeImpl;

  return {
    resize: () => {
      isResizeRequested = true;
    },
    render: createCallLatest<PipelineRender>(async (input, parameters) => {
      timer?.cpu.start('total');
      if (isResizeRequested) {
        resize();
      }
      fillWaves(windowSize, windowCount, input, waves);
      const command = createCommand(parameters);
      device.queue.submit([command]);
      await device.queue.onSubmittedWorkDone();
      timer?.cpu.end('total');

      if (timer) {
        const gpuDuration = await timer.gpu.read();
        const cpuDuration = timer.cpu.read();
        console.table({
          ...gpuDuration,
          ...cpuDuration,
        });
      }
    }),
    destroy: () => {
      timer?.gpu.destroy();
      drawer.destroy();
      fourier.destroy();
      buffers.destroy();
      magnitudeNormalizer.destroy();
      decibelNormalizer.destroy();
    },
  };
};
