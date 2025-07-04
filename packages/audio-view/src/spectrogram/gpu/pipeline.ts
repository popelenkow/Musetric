import { Colors, cpu, Pipeline, PipelineRender } from '../';
import { createCallLatest } from '../../common';
import { GpuFourierMode, gpuFouriers } from '../../fourier';
import { renderPipeline } from './renderPipeline';

export type CreatePipelineOptions = {
  canvas: HTMLCanvasElement;
  windowSize: number;
  fourierMode: GpuFourierMode;
  colors: Colors;
  device: GPUDevice;
};
export type CreatePipeline = (
  options: CreatePipelineOptions,
) => Promise<Pipeline>;

export const createPipeline: CreatePipeline = async (options) => {
  const { canvas, windowSize, fourierMode, colors, device } = options;

  const drawer = cpu.createDrawer(canvas, colors);
  const createFourier = gpuFouriers[fourierMode];
  const fourier = await createFourier({
    windowSize,
    windowCount: drawer.width,
    device,
  });

  let isResizeRequested = false;
  let buffers = cpu.createPipelineBuffers(windowSize, drawer.width);

  const resize = () => {
    drawer.resize();
    buffers = cpu.createPipelineBuffers(windowSize, drawer.width);
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
