import { createCallLatest } from '../../common';
import type { CpuFourierMode } from '../../fourier';
import { cpuFouriers } from '../../fourier';
import { Pipeline, PipelineConfigureOptions } from '../pipeline';
import { createDecibelify } from './decibelify';
import { createDraw } from './draw';
import { createFilterWave } from './filterWave';
import { createMagnitudify } from './magnitudify';
import { createPipelineArrays } from './pipelineArrays';
import { createPipelineTimer, PipelineProfile } from './pipelineTimer';
import { createScaleView } from './scaleView';
import { createSliceWaves } from './sliceWaves';

export type CreatePipelineOptions = {
  canvas: HTMLCanvasElement;
  fourierMode: CpuFourierMode;
  onProfile?: (profile: PipelineProfile) => void;
};
export const createPipeline = (
  options: CreatePipelineOptions & PipelineConfigureOptions,
): Pipeline => {
  const {
    canvas,
    windowSize,
    fourierMode,
    colors,
    sampleRate,
    minFrequency,
    maxFrequency,
    minDecibel,
    onProfile,
  } = options;

  let isConfigureRequested = true;

  const timer = createPipelineTimer(onProfile);

  const arrays = createPipelineArrays();

  const sliceWaves = timer.wrap('sliceWaves', createSliceWaves());
  const filterWave = createFilterWave();
  filterWave.run = timer.wrap('filterWave', filterWave.run);
  const createFourier = cpuFouriers[fourierMode];
  const fourier = createFourier();
  fourier.forward = timer.wrap('fourier', fourier.forward);
  const magnitudify = timer.wrap('magnitudify', createMagnitudify());
  const decibelify = timer.wrap('decibelify', createDecibelify());
  const scaleView = timer.wrap('scaleView', createScaleView());
  const draw = createDraw(canvas);
  draw.run = timer.wrap('draw', draw.run);

  const configure = timer.wrap('configure', () => {
    draw.resize();
    draw.configure(colors);
    arrays.resize(windowSize, draw.width, draw.height);
    filterWave.configure(windowSize);
    fourier.configure(windowSize);
  });

  const render = timer.wrap('total', (wave: Float32Array, progress: number) => {
    if (isConfigureRequested) {
      isConfigureRequested = false;
      configure();
    }
    const { signal, view } = arrays;
    const { height } = draw;
    const windowCount = draw.width;

    sliceWaves(windowSize, windowCount, wave, signal);
    filterWave.run(windowCount, signal.real);
    fourier.forward(signal, windowCount);
    magnitudify(windowSize, windowCount, signal);
    decibelify(windowSize, windowCount, signal.real, minDecibel);
    scaleView(
      windowSize,
      windowCount,
      height,
      sampleRate,
      minFrequency,
      maxFrequency,
      signal.real,
      view,
    );
    draw.run(view, progress);
  });

  return {
    render: createCallLatest(async (wave, progress) => {
      render(wave, progress);
      timer.finish();
    }),
    resize: () => {
      isConfigureRequested = true;
    },
    destroy: () => {
      // No resources to clean up in CPU implementation
    },
  };
};
