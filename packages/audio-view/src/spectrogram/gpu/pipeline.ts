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

  const draw = createDraw({
    device,
    canvas,
    colors,
    timestampWrites: timer.tw.draw,
  });
  const sliceWaves = timer.wrap('sliceWaves', createSliceWaves());
  const writeGpuBuffers = timer.wrap('writeGpuBuffers', (progress: number) => {
    device.queue.writeBuffer(buffers.signal.real, 0, waves.real);
    device.queue.writeBuffer(buffers.signal.imag, 0, waves.imag);
    draw.writeProgress(progress);
  });
  const filterWave = createFilterWave(device, timer.tw.filterWave);
  const createFourier = gpuFouriers[fourierMode];
  const fourier = await createFourier(device, {
    reverse: timer.tw.fourierReverse,
    transform: timer.tw.fourierTransform,
  });
  const magnitudify = createMagnitudify(device, timer.tw.magnitudify);
  const decibelify = createDecibelify(device, timer.tw.decibelify);
  const scaleView = createScaleView(device, timer.tw.scaleView);

  const resize = timer.wrap('resize', () => {
    draw.resize();
    windowCount = draw.width;
    const halfSize = windowSize / 2;
    waves = createComplexArray(windowSize * windowCount);
    buffers.resize(windowCount);
    const { signal } = buffers;
    filterWave.configure(signal.real, {
      windowSize,
      windowCount,
    });
    fourier.configure(signal, {
      windowSize,
      windowCount,
    });
    magnitudify.configure(signal, {
      windowSize,
      windowCount,
    });
    decibelify.configure(signal.real, {
      halfSize,
      windowCount,
      minDecibel,
    });
    scaleView.configure(signal.real, draw.getTextureView(), {
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
    filterWave.run(encoder);
    fourier.forward(encoder);
    magnitudify.run(encoder);
    decibelify.run(encoder);
    scaleView.run(encoder);
    draw.run(encoder);
    timer.resolve(encoder);
    return encoder.finish();
  });

  const submitCommand = timer.wrapAsync(
    'submitCommand',
    async (command: GPUCommandBuffer) => {
      device.queue.submit([command]);
      await device.queue.onSubmittedWorkDone();
    },
  );

  const render = timer.wrapAsync(
    'total',
    async (wave: Float32Array, progress: number) => {
      if (isResizeRequested) {
        isResizeRequested = false;
        resize();
      }
      sliceWaves(windowSize, windowCount, wave, waves);
      writeGpuBuffers(progress);
      const command = createCommand();
      await submitCommand(command);
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
