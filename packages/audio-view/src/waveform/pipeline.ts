import { ViewColors } from '../common/index.js';
import { createDraw } from './draw.js';
import { generateSegments } from './generateSegments.js';

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
    render: (buffer, progress) => {
      const segmentCount = Math.max(
        1,
        Math.floor(canvas.clientWidth / barStep),
      );
      const segments = generateSegments(buffer, segmentCount);
      draw.run(segments, progress, colors);
    },
  };
};
