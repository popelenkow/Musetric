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

  const arrays = createPipelineArrays();

  const sliceWaves = createSliceWaves();
  sliceWaves.run = timer.wrap('sliceWaves', sliceWaves.run);
  const filterWave = createFilterWave();
  filterWave.run = timer.wrap('filterWave', filterWave.run);
  const createFourier = cpuFouriers[fourierMode];
  const fourier = createFourier();
  fourier.forward = timer.wrap('fourier', fourier.forward);
  const magnitudify = createMagnitudify();
  magnitudify.run = timer.wrap('magnitudify', magnitudify.run);
  const decibelify = createDecibelify();
  decibelify.run = timer.wrap('decibelify', decibelify.run);
  const scaleView = createScaleView();
  scaleView.run = timer.wrap('scaleView', scaleView.run);
  const draw = createDraw(canvas);
  draw.run = timer.wrap('draw', draw.run);

  const configure = timer.wrap('configure', () => {
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

  const render = timer.wrap('total', (wave: Float32Array, progress: number) => {
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
