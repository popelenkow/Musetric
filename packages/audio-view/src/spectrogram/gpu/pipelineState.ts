import { GpuFourier, gpuFouriers } from '../../fourier';
import { createDecibelify, Decibelify } from './decibelify';
import { createDraw, Draw } from './draw';
import { createFilterWave, FilterWave } from './filterWave';
import { createMagnitudify, Magnitudify } from './magnitudify';
import { CreatePipelineOptions } from './pipeline';
import { createPipelineBuffers, PipelineBuffers } from './pipelineBuffers';
import { PipelineTimer, createPipelineTimer } from './pipelineTimer';
import { createScaleView, ScaleView } from './scaleView';
import { createSliceWaves, SliceWaves } from './sliceWaves';

export type PipelineState = {
  windowSize: number;
  windowCount: number;
  timer: PipelineTimer;
  buffers: PipelineBuffers;
  sliceWaves: SliceWaves;
  filterWave: FilterWave;
  fourier: GpuFourier;
  magnitudify: Magnitudify;
  decibelify: Decibelify;
  scaleView: ScaleView;
  draw: Draw;
  configure: () => void;
  destroy: () => void;
};

export const createPipelineState = (
  options: CreatePipelineOptions,
): PipelineState => {
  const {
    device,
    windowSize,
    fourierMode,
    canvas,
    colors,
    viewParams,
    minDecibel,
    onProfile,
  } = options;

  const timer = createPipelineTimer(device, onProfile);

  const buffers = createPipelineBuffers(device);
  const sliceWaves = createSliceWaves();
  sliceWaves.run = timer.wrap('sliceWaves', sliceWaves.run);
  const filterWave = createFilterWave(device, timer.tw.filterWave);
  const createFourier = gpuFouriers[fourierMode];
  const fourier = createFourier(device, {
    reverse: timer.tw.fourierReverse,
    transform: timer.tw.fourierTransform,
  });
  const magnitudify = createMagnitudify(device, timer.tw.magnitudify);
  const decibelify = createDecibelify(device, timer.tw.decibelify);
  const scaleView = createScaleView(device, timer.tw.scaleView);
  const draw = createDraw({
    device,
    canvas,
    colors,
    timestampWrites: timer.tw.draw,
  });

  const state: PipelineState = {
    windowSize,
    windowCount: undefined!,
    timer,
    buffers,
    sliceWaves,
    filterWave,
    fourier,
    magnitudify,
    decibelify,
    scaleView,
    draw,
    configure: timer.wrap('configure', () => {
      draw.resize();
      const windowCount = draw.width;
      state.windowCount = windowCount;
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
      scaleView.configure(signal.real, draw.getTextureView(), {
        ...viewParams,
        windowSize,
        width: draw.width,
        height: draw.height,
      });
    }),
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

  return state;
};
