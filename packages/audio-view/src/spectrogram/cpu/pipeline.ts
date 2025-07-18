import { createCallLatest } from '../../common';
import type { CpuFourierMode } from '../../fourier';
import { cpuFouriers } from '../../fourier';
import { Colors } from '../colors';
import { SignalViewParams } from '../signalViewParams';
import { sliceWaves as sliceWavesImpl } from '../sliceWaves';
import { createDrawer } from './drawer';
import { normalizeDecibel as normalizeDecibelImpl } from './normalizeDecibel';
import { normalizeMagnitude as normalizeMagnitudeImpl } from './normalizeMagnitude';
import { createPipelineArrays } from './pipelineArrays';
import { createPipelineTimer, PipelineProfile } from './pipelineTimer';
import { scaleView as scaleViewImpl } from './scaleView';

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
export const createPipeline = async (
  options: CreatePipelineOptions,
): Promise<Pipeline> => {
  const {
    canvas,
    windowSize,
    fourierMode,
    colors,
    viewParams,
    minDecibel,
    onProfile,
  } = options;

  const drawer = createDrawer({ canvas, colors });
  const createFourier = cpuFouriers[fourierMode];
  const fourier = await createFourier({ windowSize });

  const timer = createPipelineTimer(onProfile);

  let isResizeRequested = false;
  let arrays = createPipelineArrays(windowSize, drawer.width, drawer.height);

  const resize = timer.wrap('resize', () => {
    drawer.resize();
    arrays = createPipelineArrays(windowSize, drawer.width, drawer.height);
  });

  const sliceWaves = timer.wrap('sliceWaves', sliceWavesImpl);
  fourier.forward = timer.wrap('fourier', fourier.forward);
  const normalizeMagnitude = timer.wrap(
    'normalizeMagnitude',
    normalizeMagnitudeImpl,
  );
  const normalizeDecibel = timer.wrap('normalizeDecibel', normalizeDecibelImpl);
  const scaleView = timer.wrap('scaleView', scaleViewImpl);
  drawer.render = timer.wrap('draw', drawer.render);

  const render = timer.wrap('total', (wave: Float32Array, progress: number) => {
    if (isResizeRequested) {
      isResizeRequested = false;
      return resize();
    }
    const { waves, signal, view } = arrays;
    const { height } = drawer;
    const windowCount = drawer.width;

    sliceWaves(windowSize, windowCount, wave, waves);
    fourier.forward(waves, signal);
    normalizeMagnitude(windowSize, windowCount, signal);
    normalizeDecibel(windowSize, windowCount, signal.real, minDecibel);
    scaleView(windowSize, windowCount, height, viewParams, signal.real, view);
    drawer.render(view, progress);
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
