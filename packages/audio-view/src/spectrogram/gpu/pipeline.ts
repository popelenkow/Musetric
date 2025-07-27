import { createCallLatest } from '../../common';
import { GpuFourierMode, gpuFouriers } from '../../fourier';
import { createSliceWaves } from '../cpu/sliceWaves';
import { Pipeline, PipelineConfigureOptions } from '../pipeline';
import { createDecibelify } from './decibelify';
import { createDraw } from './draw';
import { createFilterWave } from './filterWave';
import { createMagnitudify } from './magnitudify';
import { createPipelineState } from './pipelineState';
import { createPipelineTimer, PipelineMetrics } from './pipelineTimer';
import { createScaleView } from './scaleView';

export type CreatePipelineOptions = {
  device: GPUDevice;
  fourierMode: GpuFourierMode;
  canvas: HTMLCanvasElement;
  onMetrics?: (metrics: PipelineMetrics) => void;
};
export const createPipeline = (
  createOptions: CreatePipelineOptions,
): Pipeline => {
  const { device, fourierMode, canvas, onMetrics } = createOptions;

  let isConfigureRequested = true;

  const timer = createPipelineTimer(device, onMetrics);
  const { markers } = timer;

  const state = createPipelineState(device, markers.writeBuffers);
  const sliceWaves = createSliceWaves(markers.sliceWaves);
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
    const {
      windowSize,
      colors,
      sampleRate,
      minFrequency,
      maxFrequency,
      minDecibel,
      windowFilter: filterName,
    } = state.options;
    const { width, height } = state.viewSize;

    const windowCount = width;
    state.configure();
    const { signal, texture, progress } = state;
    sliceWaves.configure(windowSize, windowCount);
    filterWave.configure(signal.real, windowSize, windowCount, filterName);
    fourier.configure(signal, windowSize, windowCount);
    magnitudify.configure(signal, windowSize, windowCount);
    decibelify.configure(signal.real, windowSize, windowCount, minDecibel);
    scaleView.configure(signal.real, texture.view, {
      sampleRate,
      minFrequency,
      maxFrequency,
      windowSize,
      width,
      height,
    });
    draw.configure(texture.view, progress.buffer, colors);
  });

  const createCommand = markers.createCommand(() => {
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
    sliceWaves.run(wave, state.signalArray);
    state.writeBuffers(progress);
    const command = createCommand();
    await submitCommand(command);
  });

  return {
    render: createCallLatest(async (wave, progress) => {
      await render(wave, progress);
      await timer.finish();
    }),
    configure: (newOptions: PipelineConfigureOptions) => {
      state.options = newOptions;
      isConfigureRequested = true;
    },
    resize: (viewSize) => {
      state.viewSize = viewSize;
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
