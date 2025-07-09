import { Colors, Pipeline, PipelineRender, cpu } from '../';
import { createCallLatest, createComplexGpuBufferReader } from '../../common';
import { GpuFourierMode, gpuFouriers } from '../../fourier';
import { createDrawer } from './drawer';
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

  const drawer = createDrawer(canvas, colors, windowSize, device);
  let arrays = cpu.createPipelineArrays(windowSize, drawer.width);
  const createFourier = gpuFouriers[fourierMode];
  const fourier = await createFourier({
    windowSize,
    windowCount: drawer.width,
    device,
  });
  const gpuBufferReader = createComplexGpuBufferReader({
    device,
    typeSize: Float32Array.BYTES_PER_ELEMENT,
    size: windowSize * drawer.width,
  });

  let isResizeRequested = false;

  return {
    resize: () => {
      isResizeRequested = true;
    },
    render: createCallLatest<PipelineRender>(async (input, parameters) => {
      if (isResizeRequested) {
        isResizeRequested = false;
        drawer.resize();
        arrays = cpu.createPipelineArrays(windowSize, drawer.width);
        fourier.resize(drawer.width);
        gpuBufferReader.resize(windowSize * drawer.width);
      }
      await renderPipeline({
        input,
        parameters,
        windowSize,
        drawer,
        arrays,
        fourier,
        gpuBufferReader,
      });
    }),
  };
};
