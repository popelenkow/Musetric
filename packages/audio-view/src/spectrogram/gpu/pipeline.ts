import { Colors, SignalViewParams, createSliceWaves } from '..';
import { createCallLatest, createComplexArray } from '../../common';
import { GpuFourierMode, gpuFouriers } from '../../fourier';
import { createDecibelify } from './decibelify';
import { createDraw } from './draw';
import { createFilterWave } from './filterWave';
import { createMagnitudify } from './magnitudify';
import { createPipelineBuffers } from './pipelineBuffers';
import { createPipelineTimer, PipelineProfile } from './pipelineTimer';
import { createScaleView } from './scaleView';

export type CreatePipelineOptions = {
  device: GPUDevice;
  windowSize: number;
  fourierMode: GpuFourierMode;
  canvas: HTMLCanvasElement;
  colors: Colors;
  viewParams: SignalViewParams;
  minDecibel: number;
  onProfile?: (profile: PipelineProfile) => void;
};

export type Pipeline = {
  render: (wave: Float32Array, progress: number) => Promise<void>;
  resize: () => void;
  destroy: () => void;
};

export const createPipeline = async (
  options: CreatePipelineOptions,
): Promise<Pipeline> => {
  const {
    device,
    windowSize,
    fourierMode,
    canvas,
    colors,
    viewParams,
    minDecibel,
    onProfile,
  } = options;

  let windowCount = 1;
  let isResizeRequested = true;

  const timer = createPipelineTimer(device, onProfile);

  let waves = createComplexArray(windowSize * windowCount);
  const buffers = createPipelineBuffers({ device, windowSize, windowCount });

  const sliceWaves = timer.wrap('sliceWaves', createSliceWaves());
  const writeGpuWaves = timer.wrap('writeGpuWaves', () => {
    device.queue.writeBuffer(buffers.signal.real, 0, waves.real);
    device.queue.writeBuffer(buffers.signal.imag, 0, waves.imag);
  });
  const filterWave = createFilterWave(device, timer.tw.filterWave);
  const createFourier = gpuFouriers[fourierMode];
  const fourier = await createFourier({
    device,
    windowSize,
    timestampWrites: {
      reverse: timer.tw.fourierReverse,
      transform: timer.tw.fourierTransform,
    },
  });
  const magnitudify = createMagnitudify(device, timer.tw.magnitudify);
  const decibelify = createDecibelify(device, timer.tw.decibelify);
  const scaleView = createScaleView(device, timer.tw.scaleView);
  const draw = createDraw({
    device,
    canvas,
    colors,
    timestampWrites: timer.tw.draw,
  });

  const resize = timer.wrap('resize', () => {
    draw.resize();
    windowCount = draw.width;
    const halfSize = windowSize / 2;
    waves = createComplexArray(windowSize * windowCount);
    buffers.resize(windowCount);
    filterWave.writeParams({
      windowSize,
      windowCount,
    });
    fourier.writeParams({
      windowSize,
      windowCount,
    });
    magnitudify.writeParams({
      windowSize,
      windowCount,
    });
    decibelify.writeParams({
      halfSize,
      windowCount,
      minDecibel,
    });
    scaleView.writeParams({
      ...viewParams,
      windowSize,
      width: draw.width,
      height: draw.height,
    });
  });

  const createCommand = timer.wrap('createCommand', () => {
    const encoder = device.createCommandEncoder({
      label: 'pipeline-render-encoder',
    });
    filterWave.run(encoder, buffers.signal.real);
    fourier.forward(encoder, buffers.signal);
    magnitudify.run(encoder, buffers.signal);
    decibelify.run(encoder, buffers.signal.real);
    scaleView.run(encoder, buffers.signal.real, draw.getTextureView());
    draw.run(encoder);
    timer.resolve(encoder);
    return encoder.finish();
  });

  const render = timer.wrapAsync(
    'render',
    async (wave: Float32Array, progress: number) => {
      if (isResizeRequested) {
        isResizeRequested = false;
        resize();
      }
      sliceWaves(windowSize, windowCount, wave, waves);
      writeGpuWaves();
      draw.writeProgress(progress);
      const command = createCommand();
      device.queue.submit([command]);
      await device.queue.onSubmittedWorkDone();
    },
  );

  return {
    render: createCallLatest(async (wave, progress) => {
      await render(wave, progress);
      await timer.finish();
    }),
    resize: () => {
      isResizeRequested = true;
    },
    destroy: () => {
      timer.destroy();
      buffers.destroy();
      filterWave.destroy();
      fourier.destroy();
      magnitudify.destroy();
      decibelify.destroy();
      scaleView.destroy();
      draw.destroy();
    },
  };
};
