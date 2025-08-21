import { createCallLatest } from '@musetric/resource-utils/callLatest';
import { GpuFourierMode, gpuFouriers } from '../../fourier';
import { Pipeline } from '../pipeline';
import { createDecibelify } from './decibelify';
import { createDraw } from './draw';
import { createMagnitudify } from './magnitudify';
import { createPipelineState } from './pipelineState';
import { createPipelineTimer, PipelineMetrics } from './pipelineTimer';
import { createRemap } from './remap';
import { createSliceWave } from './sliceWave';
import { createWindowing } from './windowing';

export type CreatePipelineOptions = {
  device: GPUDevice;
  fourierMode: GpuFourierMode;
  canvas: HTMLCanvasElement;
  onMetrics?: (metrics: PipelineMetrics) => void;
};
export const createPipeline = (options: CreatePipelineOptions): Pipeline => {
  const { device, fourierMode, canvas, onMetrics } = options;

  let isConfigureRequested = true;

  const timer = createPipelineTimer(device, onMetrics);
  const { markers } = timer;

  const state = createPipelineState(device);
  const sliceWave = createSliceWave(device, markers.sliceWave);
  const windowing = createWindowing(device, markers.windowing);
  const fourier = gpuFouriers[fourierMode](device, {
    reverse: markers.fourierReverse,
    transform: markers.fourierTransform,
  });
  const magnitudify = createMagnitudify(device, markers.magnitudify);
  const decibelify = createDecibelify(device, markers.decibelify);
  const remap = createRemap(device, markers.remap);
  const draw = createDraw(device, canvas, markers.draw);

  const configure = markers.configure(() => {
    state.configure();
    const { config, signal, texture } = state;
    sliceWave.configure(signal.real, config);
    windowing.configure(signal.real, config);
    fourier.configure(signal, {
      ...config,
      windowSize: config.windowSize * config.zeroPaddingFactor,
    });
    magnitudify.configure(signal, config);
    decibelify.configure(signal.real, config);
    remap.configure(signal.real, texture.view, config);
    draw.configure(texture.view, config);
  });

  const writeBuffers = markers.writeBuffers(
    (wave: Float32Array<ArrayBuffer>, progress: number) => {
      sliceWave.write(wave, progress);
    },
  );
  const createCommand = markers.createCommand(() => {
    const encoder = device.createCommandEncoder({
      label: 'pipeline-render-encoder',
    });
    sliceWave.run(encoder);
    state.zerofyImag(encoder);
    windowing.run(encoder);
    fourier.forward(encoder);
    magnitudify.run(encoder);
    decibelify.run(encoder);
    remap.run(encoder);
    draw.run(encoder);
    timer.resolve(encoder);
    return encoder.finish();
  });

  const submitCommand = markers.submitCommand(
    async (command: GPUCommandBuffer) => {
      device.queue.submit([command]);
      await device.queue.onSubmittedWorkDone();
    },
  );

  const render = markers.total(
    async (wave: Float32Array<ArrayBuffer>, progress: number) => {
      if (isConfigureRequested) {
        isConfigureRequested = false;
        configure();
      }

      writeBuffers(wave, progress);
      const command = createCommand();
      await submitCommand(command);
    },
  );

  return {
    render: createCallLatest(async (wave, progress) => {
      await render(wave, progress);
      await timer.finish();
    }),
    configure: (newConfig) => {
      state.config = {
        ...newConfig,
        windowCount: newConfig.viewSize.width,
      };
      isConfigureRequested = true;
    },
    destroy: () => {
      timer.destroy();
      state.destroy();
      windowing.destroy();
      fourier.destroy();
      magnitudify.destroy();
      decibelify.destroy();
      remap.destroy();
      draw.destroy();
    },
  };
};
