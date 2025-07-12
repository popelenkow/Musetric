import { createCallLatest } from '../../common';
import type { CpuFourierMode } from '../../fourier';
import { cpuFouriers } from '../../fourier';
import { Colors } from '../colors';
import { Pipeline, PipelineRender } from '../pipeline';
import { createDrawer } from './drawer';
import { createPipelineArrays } from './pipelineArrays';
import { renderPipeline } from './renderPipeline';

export type CreatePipelineOptions = {
  canvas: HTMLCanvasElement;
  windowSize: number;
  fourierMode: CpuFourierMode;
  colors: Colors;
};
export const createPipeline = async (
  options: CreatePipelineOptions,
): Promise<Pipeline> => {
  const { canvas, windowSize, fourierMode, colors } = options;

  const drawer = createDrawer(canvas, colors, windowSize);
  const createFourier = cpuFouriers[fourierMode];
  const fourier = await createFourier({ windowSize });

  let isResizeRequested = false;
  let arrays = createPipelineArrays(windowSize, drawer.width);

  return {
    resize: () => {
      isResizeRequested = true;
    },
    render: createCallLatest<PipelineRender>(async (input, parameters) => {
      if (isResizeRequested) {
        isResizeRequested = false;
        drawer.resize();
        arrays = createPipelineArrays(windowSize, drawer.width);
        fourier.resize(drawer.width);
      }
      await renderPipeline({
        input,
        parameters,
        windowSize,
        drawer,
        arrays,
        fourier,
      });
    }),
    destroy: () => {
      fourier.destroy();
    },
  };
};
