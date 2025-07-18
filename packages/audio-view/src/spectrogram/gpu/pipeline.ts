import { Colors, SignalViewParams, sliceWaves as sliceWavesImpl } from '..';
import { createCallLatest, createComplexArray } from '../../common';
import { GpuFourierMode, gpuFouriers } from '../../fourier';
import { createDecibelNormalizer } from './decibelNormalizer';
import { createDrawer } from './drawer';
import { createMagnitudeNormalizer } from './magnitudeNormalizer';
import { createPipelineBuffers } from './pipelineBuffers';
import { createPipelineTimer, PipelineProfile } from './pipelineTimer';
import { createViewScaler } from './viewScaler';

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

  const sliceWaves = timer.wrap('sliceWaves', sliceWavesImpl);
  const writeGpuWaves = timer.wrap('writeGpuWaves', () => {
    device.queue.writeBuffer(buffers.signal.real, 0, waves.real);
    device.queue.writeBuffer(buffers.signal.imag, 0, waves.imag);
  });
  const createFourier = gpuFouriers[fourierMode];
  const fourier = await createFourier({
    device,
    windowSize,
    timestampWrites: {
      reverse: timer.tw.fourierReverse,
      transform: timer.tw.fourierTransform,
    },
  });
  const magnitudeNormalizer = createMagnitudeNormalizer(
    device,
    timer.tw.normalizeMagnitude,
  );
  const decibelNormalizer = createDecibelNormalizer(
    device,
    timer.tw.normalizeDecibel,
  );
  const viewScaler = createViewScaler(device, timer.tw.scaleView);
  const drawer = createDrawer({
    device,
    canvas,
    colors,
    timestampWrites: timer.tw.draw,
  });

  const resize = timer.wrap('resize', () => {
    drawer.resize();
    windowCount = drawer.width;
    const halfSize = windowSize / 2;
    waves = createComplexArray(windowSize * windowCount);
    buffers.resize(windowCount);
    fourier.writeParams({
      windowSize,
      windowCount,
    });
    magnitudeNormalizer.writeParams({
      windowSize,
      windowCount,
    });
    decibelNormalizer.writeParams({
      halfSize,
      windowCount,
      minDecibel,
    });
    viewScaler.writeParams({
      ...viewParams,
      windowSize,
      width: drawer.width,
      height: drawer.height,
    });
  });

  const createCommand = timer.wrap('createCommand', () => {
    const encoder = device.createCommandEncoder({ label: 'render-pipeline' });
    fourier.forward(encoder, buffers.signal);
    magnitudeNormalizer.run(encoder, buffers.signal);
    decibelNormalizer.run(encoder, buffers.signal.real);
    viewScaler.run(encoder, buffers.signal.real, drawer.getTextureView());
    drawer.render(encoder);
    timer.resolve(encoder);
    return encoder.finish();
  });

  const render = timer.wrapAsync(
    'total',
    async (wave: Float32Array, progress: number) => {
      if (isResizeRequested) {
        isResizeRequested = false;
        resize();
      }
      sliceWaves(windowSize, windowCount, wave, waves);
      writeGpuWaves();
      drawer.writeProgress(progress);
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
      fourier.destroy();
      magnitudeNormalizer.destroy();
      decibelNormalizer.destroy();
      viewScaler.destroy();
      drawer.destroy();
    },
  };
};
