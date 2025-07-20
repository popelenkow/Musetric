import { createCallLatest } from '../../common';
import type { CpuFourierMode } from '../../fourier';
import { cpuFouriers } from '../../fourier';
import { Colors } from '../colors';
import { SignalViewParams } from '../signalViewParams';
import { createSliceWaves } from '../sliceWaves';
import { createDecibelify } from './decibelify';
import { createDraw } from './draw';
import { createFilterWave } from './filterWave';
import { createMagnitudify } from './magnitudify';
import { createPipelineArrays } from './pipelineArrays';
import { createPipelineTimer, PipelineProfile } from './pipelineTimer';
import { createScaleView } from './scaleView';

export type CreatePipelineOptions = {
  canvas: HTMLCanvasElement;
  windowSize: number;
  fourierMode: CpuFourierMode;
  colors: Colors;
  viewParams: SignalViewParams;
  minDecibel: number;
  onProfile?: (profile: PipelineProfile) => void;
};

export type Pipeline = {
  render: (wave: Float32Array, progress: number) => Promise<void>;
  resize: () => void;
  destroy: () => void;
};
export const createPipeline = (options: CreatePipelineOptions): Pipeline => {
  const {
    canvas,
    windowSize,
    fourierMode,
    colors,
    viewParams,
    minDecibel,
    onProfile,
  } = options;

  const draw = createDraw({ canvas, colors });
  const createFourier = cpuFouriers[fourierMode];
  const fourier = createFourier({ windowSize });

  const timer = createPipelineTimer(onProfile);

  let isResizeRequested = false;
  let arrays = createPipelineArrays(windowSize, draw.width, draw.height);

  const resize = timer.wrap('resize', () => {
    draw.resize();
    arrays = createPipelineArrays(windowSize, draw.width, draw.height);
  });

  const sliceWaves = timer.wrap('sliceWaves', createSliceWaves());
  const filterWave = timer.wrap('filterWave', createFilterWave(windowSize));
  fourier.forward = timer.wrap('fourier', fourier.forward);
  const magnitudify = timer.wrap('magnitudify', createMagnitudify());
  const decibelify = timer.wrap('decibelify', createDecibelify());
  const scaleView = timer.wrap('scaleView', createScaleView());
  draw.run = timer.wrap('draw', draw.run);

  const render = timer.wrap(
    'render',
    (wave: Float32Array, progress: number) => {
      if (isResizeRequested) {
        isResizeRequested = false;
        return resize();
      }
      const { signal, view } = arrays;
      const { height } = draw;
      const windowCount = draw.width;

      sliceWaves(windowSize, windowCount, wave, signal);
      filterWave(windowCount, signal.real);
      fourier.forward(signal, windowCount);
      magnitudify(windowSize, windowCount, signal);
      decibelify(windowSize, windowCount, signal.real, minDecibel);
      scaleView(windowSize, windowCount, height, viewParams, signal.real, view);
      draw.run(view, progress);
    },
  );

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
