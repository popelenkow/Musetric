import { createCallLatest } from '../../common';
import type { CpuFourierMode } from '../../fourier';
import { cpuFouriers } from '../../fourier';
import { Colors } from '../colors';
import { SignalViewParams } from '../signalViewParams';
import { sliceWaves } from '../sliceWaves';
import { createDrawer } from './drawer';
import { normalizeDecibel } from './normalizeDecibel';
import { normalizeMagnitude } from './normalizeMagnitude';
import { createPipelineArrays } from './pipelineArrays';
import { scaleView } from './scaleView';

export type CreatePipelineOptions = {
  canvas: HTMLCanvasElement;
  windowSize: number;
  fourierMode: CpuFourierMode;
  colors: Colors;
  viewParams: SignalViewParams;
  minDecibel: number;
};

export type Pipeline = {
  render: (wave: Float32Array, progress: number) => Promise<void>;
  resize: () => void;
  destroy: () => void;
};
export const createPipeline = async (
  options: CreatePipelineOptions,
): Promise<Pipeline> => {
  const { canvas, windowSize, fourierMode, colors, viewParams, minDecibel } =
    options;

  const drawer = createDrawer({ canvas, colors });
  const createFourier = cpuFouriers[fourierMode];
  const fourier = await createFourier({ windowSize });

  let isResizeRequested = false;
  let arrays = createPipelineArrays(windowSize, drawer.width, drawer.height);

  const resize = () => {
    drawer.resize();
    arrays = createPipelineArrays(windowSize, drawer.width, drawer.height);
  };

  const render = (wave: Float32Array, progress: number) => {
    if (isResizeRequested) {
      isResizeRequested = false;
      return resize();
    }
    const { waves, signal, magnitudes, view } = arrays;
    const { height } = drawer;
    const windowCount = drawer.width;

    sliceWaves(windowSize, windowCount, wave, waves);
    fourier.forward(waves, signal);
    normalizeMagnitude(windowSize, windowCount, signal, magnitudes);
    normalizeDecibel(windowSize, windowCount, magnitudes, minDecibel);
    scaleView(windowSize, windowCount, height, viewParams, magnitudes, view);
    drawer.render(view, progress);
  };

  return {
    render: createCallLatest(async (wave, progress) => {
      render(wave, progress);
    }),
    resize: () => {
      isResizeRequested = true;
    },
    destroy: () => {
      // No resources to clean up in CPU implementation
    },
  };
};
