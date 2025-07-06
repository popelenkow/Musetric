import { Colors } from './colors';
import { createDrawer } from './drawer';
import { generateSegments } from './generateSegments';

export type PipelineRender = (buffer: Float32Array, progress: number) => void;

export type Pipeline = {
  render: PipelineRender;
};

export const createPipeline = (
  canvas: HTMLCanvasElement,
  colors: Colors,
): Pipeline => {
  const drawer = createDrawer(canvas);

  const render: PipelineRender = async (buffer, progress) => {
    const segments = generateSegments(buffer, canvas.clientWidth);
    drawer.render(segments, progress, colors);
  };
  return { render };
};
