import { createCallLatest } from '../../common';
import { GpuFourierMode, gpuFouriers } from '../../fourier';
import { Pipeline, PipelineConfigureOptions } from '../pipeline';
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
export const createPipeline = (
  createOptions: CreatePipelineOptions,
): Pipeline => {
  const { device, fourierMode, canvas, onMetrics } = createOptions;

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
    const {
      windowSize,
      viewSize,
      colors,
      sampleRate,
      minFrequency,
      maxFrequency,
      minDecibel,
      windowFilter,
      visibleTimeBefore,
      visibleTimeAfter,
      zeroPaddingFactor,
    } = state.options;
    const { width, height } = viewSize;

    const windowCount = width;
    const paddedWindowSize = windowSize * zeroPaddingFactor;
    state.configure();
    const { signal, texture } = state;
    sliceWaves.configure(signal.real, {
      windowSize,
      windowCount,
      sampleRate,
      visibleTimeBefore,
      visibleTimeAfter,
      zeroPaddingFactor,
    });
    filterWave.configure(
      signal.real,
      windowSize,
      windowCount,
      windowFilter,
      zeroPaddingFactor,
    );
    fourier.configure(signal, paddedWindowSize, windowCount);
    magnitudify.configure(signal, paddedWindowSize, windowCount);
    decibelify.configure(
      signal.real,
      paddedWindowSize,
      windowCount,
      minDecibel,
    );
    scaleView.configure(signal.real, texture.view, {
      sampleRate,
      minFrequency,
      maxFrequency,
      windowSize: paddedWindowSize,
      width,
      height,
    });
    draw.configure(texture.view, colors, visibleTimeBefore, visibleTimeAfter);
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
    configure: (newOptions: PipelineConfigureOptions) => {
      state.options = newOptions;
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
