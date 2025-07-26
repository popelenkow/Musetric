import { createCallLatest } from '../../common';
import { GpuFourierMode, gpuFouriers } from '../../fourier';
import { Pipeline, PipelineConfigureOptions } from '../pipeline';
import { createDecibelify } from './decibelify';
import { createDraw } from './draw';
import { createFilterWave } from './filterWave';
import { createMagnitudify } from './magnitudify';
import { createPipelineBuffers } from './pipelineBuffers';
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let options: PipelineConfigureOptions = undefined!;

  const timer = createPipelineTimer(device, onMetrics);
  const { markers } = timer;

  const buffers = createPipelineBuffers(device);
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
    } = options;

    draw.resize();
    const windowCount = draw.width;
    const halfSize = windowSize / 2;
    buffers.resize(windowSize, windowCount);
    const { signal } = buffers;
    sliceWaves.configure(windowSize, windowCount);
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
    draw.configure(colors);
    scaleView.configure(signal.real, draw.getTextureView(), {
      sampleRate,
      minFrequency,
      maxFrequency,
      windowSize,
      width: draw.width,
      height: draw.height,
    });
  });

  const writeBuffers = markers.writeBuffers((progress: number) => {
    const { signal, signalArray } = buffers;
    device.queue.writeBuffer(signal.real, 0, signalArray.real);
    device.queue.writeBuffer(signal.imag, 0, signalArray.imag);
    draw.writeProgress(progress);
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
    sliceWaves.run(wave, buffers.signalArray);
    writeBuffers(progress);
    const command = createCommand();
    await submitCommand(command);
  });

  return {
    render: createCallLatest(async (wave, progress) => {
      await render(wave, progress);
      await timer.finish();
    }),
    configure: (newOptions: PipelineConfigureOptions) => {
      options = newOptions;
      isConfigureRequested = true;
    },
    resize: () => {
      isConfigureRequested = true;
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
