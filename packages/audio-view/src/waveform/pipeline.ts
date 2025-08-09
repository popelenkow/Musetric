import { ViewColors } from '../common';
import { createDraw } from './draw';
import { generateSegments } from './generateSegments';

export type Pipeline = {
  render: (buffer: Float32Array<ArrayBuffer>, progress: number) => void;
};
export const createPipeline = (
  canvas: HTMLCanvasElement,
  colors: ViewColors,
): Pipeline => {
  const draw = createDraw(canvas);

  const barStep = 3;

  return {
    render: async (buffer, progress) => {
      const segmentCount = Math.max(
        1,
        Math.floor(canvas.clientWidth / barStep),
      );
      const segments = generateSegments(buffer, segmentCount);
      draw.run(segments, progress, colors);
    },
  };
};
