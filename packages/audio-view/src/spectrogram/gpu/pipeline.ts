import { createCallLatest } from '../../common';
import { GpuFourierMode, gpuFouriers } from '../../fourier';
import { Pipeline } from '../pipeline';
import { createDecibelify } from './decibelify';
import { createDraw } from './draw';
import { createFilterWave } from './filterWave';
import { createMagnitudify } from './magnitudify';
import { createPipelineState } from './pipelineState';
import { createPipelineTimer, PipelineMetrics } from './pipelineTimer';
import { createScaleView } from './scaleView';
import { createSliceWaves } from './sliceWaves';

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
  const sliceWaves = createSliceWaves(
    device,
    markers.sliceWaves,
    markers.writeBuffers,
  );
  const filterWave = createFilterWave(device, markers.filterWave);
  const fourier = gpuFouriers[fourierMode](device, {
    reverse: markers.fourierReverse,
    transform: markers.fourierTransform,
  });
  const magnitudify = createMagnitudify(device, markers.magnitudify);
  const decibelify = createDecibelify(device, markers.decibelify);
  const scaleView = createScaleView(device, markers.scaleView);
  const draw = createDraw(device, canvas, markers.draw);

  const configure = markers.configure(() => {
    state.configure();
    const { config, signal, texture } = state;
    sliceWaves.configure(signal.real, config);
    filterWave.configure(signal.real, config);
    fourier.configure(signal, {
      ...config,
      windowSize: config.windowSize * config.zeroPaddingFactor,
    });
    magnitudify.configure(signal, config);
    decibelify.configure(signal.real, config);
    scaleView.configure(signal.real, texture.view, config);
    draw.configure(texture.view, config);
  });

  const createCommand = markers.createCommand(() => {
    const encoder = device.createCommandEncoder({
      label: 'pipeline-render-encoder',
    });
    sliceWaves.run(encoder);
    state.zerofyImag(encoder);
    filterWave.run(encoder);
    fourier.forward(encoder);
    magnitudify.run(encoder);
    decibelify.run(encoder);
    scaleView.run(encoder);
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

  const render = markers.total(async (wave: Float32Array, progress: number) => {
    if (isConfigureRequested) {
      isConfigureRequested = false;
      configure();
    }

    sliceWaves.write(wave, progress);
    const command = createCommand();
    await submitCommand(command);
  });

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
      filterWave.destroy();
      fourier.destroy();
      magnitudify.destroy();
      decibelify.destroy();
      scaleView.destroy();
      draw.destroy();
    },
  };
};
