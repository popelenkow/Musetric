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

  let isResizeRequested = false;

  const timer = createPipelineTimer(onProfile);

  const draw = createDraw({ canvas, colors });
  draw.run = timer.wrap('draw', draw.run);
  let arrays = createPipelineArrays(windowSize, draw.width, draw.height);

  const sliceWaves = timer.wrap('sliceWaves', createSliceWaves());
  const filterWave = timer.wrap('filterWave', createFilterWave(windowSize));
  const createFourier = cpuFouriers[fourierMode];
  const fourier = createFourier({ windowSize });
  fourier.forward = timer.wrap('fourier', fourier.forward);
  const magnitudify = timer.wrap('magnitudify', createMagnitudify());
  const decibelify = timer.wrap('decibelify', createDecibelify());
  const scaleView = timer.wrap('scaleView', createScaleView());

  const configure = timer.wrap('configure', () => {
    draw.resize();
    arrays = createPipelineArrays(windowSize, draw.width, draw.height);
  });

  const render = timer.wrap('total', (wave: Float32Array, progress: number) => {
    if (isResizeRequested) {
      isResizeRequested = false;
      configure();
    }
    const { signal, view } = arrays;
    const { height } = draw;
    const windowCount = draw.width;

    sliceWaves(windowSize, windowCount, wave, signal);
    filterWave(windowCount, signal.real);
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
      isResizeRequested = true;
    },
    destroy: () => {
      // No resources to clean up in CPU implementation
    },
  };
};
