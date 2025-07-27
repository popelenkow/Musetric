import { createCallLatest } from '../../common';
import type { CpuFourierMode } from '../../fourier';
import { cpuFouriers } from '../../fourier';
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
  canvas: HTMLCanvasElement;
  fourierMode: CpuFourierMode;
  onMetrics?: (metrics: PipelineMetrics) => void;
};
export const createPipeline = (
  createOptions: CreatePipelineOptions,
): Pipeline => {
  const { canvas, fourierMode, onMetrics } = createOptions;

  let isConfigureRequested = true;

  const timer = createPipelineTimer(onMetrics);
  const { markers } = timer;

  const state = createPipelineState(markers.zerofyImag);
  const sliceWaves = createSliceWaves(markers.sliceWaves);
  const filterWave = createFilterWave(markers.filterWave);
  const fourier = cpuFouriers[fourierMode](markers.fourier);
  const magnitudify = createMagnitudify(markers.magnitudify);
  const decibelify = createDecibelify(markers.decibelify);
  const scaleView = createScaleView(markers.scaleView);
  const draw = createDraw(canvas, markers.draw);

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
    } = state.options;
    const { width, height } = viewSize;
    const windowCount = width;
    state.configure();
    sliceWaves.configure(windowSize, windowCount);
    filterWave.configure(windowSize, windowCount, windowFilter);
    fourier.configure(windowSize, windowCount);
    magnitudify.configure(windowSize, windowCount);
    decibelify.configure(windowSize, windowCount, minDecibel);
    scaleView.configure(
      windowSize,
      windowCount,
      height,
      sampleRate,
      minFrequency,
      maxFrequency,
    );
    draw.configure(viewSize, colors);
  });

  const render = markers.total((wave: Float32Array, progress: number) => {
    if (isConfigureRequested) {
      isConfigureRequested = false;
      configure();
    }
    const { signal, view } = state;
    sliceWaves.run(wave, signal.real);
    state.zerofyImag();
    filterWave.run(signal.real);
    fourier.forward(signal);
    magnitudify.run(signal);
    decibelify.run(signal.real);
    scaleView.run(signal.real, view);
    draw.run(view, progress);
  });

  return {
    render: createCallLatest(async (wave, progress) => {
      render(wave, progress);
      timer.finish();
    }),
    configure: (newOptions: PipelineConfigureOptions) => {
      state.options = newOptions;
      isConfigureRequested = true;
    },
    destroy: () => {
      // No resources to clean up in CPU implementation
    },
  };
};
