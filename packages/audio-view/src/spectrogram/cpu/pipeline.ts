import { createCallLatest } from '../../common';
import type { CpuFourierMode } from '../../fourier';
import { cpuFouriers } from '../../fourier';
import { Pipeline, PipelineConfigureOptions } from '../pipeline';
import { createDecibelify } from './decibelify';
import { createDraw } from './draw';
import { createFilterWave } from './filterWave';
import { createMagnitudify } from './magnitudify';
import { createPipelineArrays } from './pipelineArrays';
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let options: PipelineConfigureOptions = undefined!;

  const timer = createPipelineTimer(onMetrics);
  const { markers } = timer;

  const arrays = createPipelineArrays();

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
      colors,
      sampleRate,
      minFrequency,
      maxFrequency,
      minDecibel,
    } = options;

    draw.resize();
    const windowCount = draw.width;
    arrays.resize(windowSize, windowCount, draw.height);
    sliceWaves.configure(windowSize, windowCount);
    filterWave.configure(windowSize, windowCount);
    fourier.configure(windowSize, windowCount);
    magnitudify.configure(windowSize, windowCount);
    decibelify.configure(windowSize, windowCount, minDecibel);
    scaleView.configure(
      windowSize,
      windowCount,
      draw.height,
      sampleRate,
      minFrequency,
      maxFrequency,
    );
    draw.configure(colors);
  });

  const render = markers.total((wave: Float32Array, progress: number) => {
    if (isConfigureRequested) {
      isConfigureRequested = false;
      configure();
    }
    const { signal, view } = arrays;
    sliceWaves.run(wave, signal);
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
      options = newOptions;
      isConfigureRequested = true;
    },
    resize: () => {
      isConfigureRequested = true;
    },
    destroy: () => {
      // No resources to clean up in CPU implementation
    },
  };
};
