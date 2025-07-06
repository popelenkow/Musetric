import { createCallLatest } from '../../common';
import type { CpuFourierMode } from '../../fourier';
import { cpuFouriers } from '../../fourier';
import { Colors } from '../colors';
import { Pipeline, PipelineRender } from '../pipeline';
import { createDrawer } from './drawer';
import { createPipelineBuffers } from './pipelineBuffers';
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

  const drawer = createDrawer(canvas, colors);
  const createFourier = cpuFouriers[fourierMode];
  const fourier = await createFourier({ windowSize });

  let isResizeRequested = false;
  let buffers = createPipelineBuffers(windowSize, drawer.width);

  const resize = () => {
    drawer.resize();
    buffers = createPipelineBuffers(windowSize, drawer.width);
    fourier.resize(drawer.width);
  };

  return {
    resize: () => {
      isResizeRequested = true;
    },
    render: createCallLatest<PipelineRender>(async (input, parameters) => {
      if (isResizeRequested) {
        isResizeRequested = false;
        resize();
      }
      await renderPipeline({
        input,
        parameters,
        windowSize,
        drawer,
        buffers,
        fourier,
      });
    }),
  };
};
