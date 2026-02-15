import { type ViewColors } from '../common/index.js';
import { createDraw } from './draw.js';
import { generateSegments } from './generateSegments.js';

export type Pipeline = {
  render: (wave: Float32Array<ArrayBuffer>, progress: number) => void;
};
export const createPipeline = (
  canvas: HTMLCanvasElement,
  colors: ViewColors,
): Pipeline => {
  const draw = createDraw(canvas);

  const barStep = 3;

  return {
    render: (wave, progress) => {
      const segmentCount = Math.max(
        1,
        Math.floor(canvas.clientWidth / barStep),
      );
      const segments = generateSegments(wave, segmentCount);
      draw.run(segments, progress, colors);
    },
  };
};
