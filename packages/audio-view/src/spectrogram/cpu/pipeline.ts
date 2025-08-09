import { createCallLatest } from '../../common';
import type { CpuFourierMode } from '../../fourier';
import { cpuFouriers } from '../../fourier';
import { Pipeline } from '../pipeline';
import { createDecibelify } from './decibelify';
import { createDraw } from './draw';
import { createMagnitudify } from './magnitudify';
import { createPipelineState } from './pipelineState';
import { createPipelineTimer, PipelineMetrics } from './pipelineTimer';
import { createRemap } from './remap';
import { createSliceWave } from './sliceWave';
import { createWindowing } from './windowing';

export type CreatePipelineOptions = {
  canvas: HTMLCanvasElement;
  fourierMode: CpuFourierMode;
  onMetrics?: (metrics: PipelineMetrics) => void;
};
export const createPipeline = (options: CreatePipelineOptions): Pipeline => {
  const { canvas, fourierMode, onMetrics } = options;

  let isConfigureRequested = true;

  const timer = createPipelineTimer(onMetrics);
  const { markers } = timer;

  const state = createPipelineState(markers.zerofyImag);
  const sliceWave = createSliceWave(markers.sliceWave);
  const windowing = createWindowing(markers.windowing);
  const fourier = cpuFouriers[fourierMode](markers.fourier);
  const magnitudify = createMagnitudify(markers.magnitudify);
  const decibelify = createDecibelify(markers.decibelify);
  const remap = createRemap(markers.remap);
  const draw = createDraw(canvas, markers.draw);

  const configure = markers.configure(() => {
    state.configure();
    const { config } = state;
    sliceWave.configure(config);
    windowing.configure(config);
    fourier.configure({
      ...config,
      windowSize: config.windowSize * config.zeroPaddingFactor,
    });
    magnitudify.configure(config);
    decibelify.configure(config);
    remap.configure(config);
    draw.configure(config);
  });

  const render = markers.total(
    (wave: Float32Array<ArrayBuffer>, progress: number) => {
      if (isConfigureRequested) {
        isConfigureRequested = false;
        configure();
      }
      const { signal, view } = state;
      sliceWave.run(wave, signal.real, progress);
      state.zerofyImag();
      windowing.run(signal.real);
      fourier.forward(signal);
      magnitudify.run(signal);
      decibelify.run(signal.real);
      remap.run(signal.real, view);
      draw.run(view);
    },
  );

  return {
    render: createCallLatest(async (wave, progress) => {
      render(wave, progress);
      timer.finish();
    }),
    configure: (newConfig) => {
      state.config = {
        ...newConfig,
        windowCount: newConfig.viewSize.width,
      };
      isConfigureRequested = true;
    },
    destroy: () => {
      // No resources to clean up in CPU implementation
    },
  };
};
