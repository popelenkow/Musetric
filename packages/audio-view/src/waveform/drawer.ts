import { Colors } from './colors';
import { WaveSegment } from './generateSegments';

export type DrawerRender = (
  segments: WaveSegment[],
  progress: number,
  colors: Colors,
) => void;
export type Drawer = {
  render: DrawerRender;
};
export const createDrawer = (canvas: HTMLCanvasElement): Drawer => {
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Context 2D not available on the canvas');
  }
  const render: DrawerRender = (segments, progress, colors) => {
    const width = canvas.clientWidth;
    const height = canvas.height;
    canvas.width = width;
    canvas.height = height;

    context.clearRect(0, 0, width, height);

    const clampedProgress = Math.max(0, Math.min(progress, 1));
    const playedCount = Math.floor(clampedProgress * segments.length);

    context.strokeStyle = colors.unplayed;
    context.beginPath();
    for (let i = 0; i < segments.length; i++) {
      const { min, max } = segments[i];
      context.moveTo(i, height * ((1 - max) / 2));
      context.lineTo(i, height * ((1 - min) / 2));
    }
    context.stroke();

    context.strokeStyle = colors.played;
    context.beginPath();
    for (let i = 0; i < playedCount; i++) {
      const { min, max } = segments[i];
      context.moveTo(i, height * ((1 - max) / 2));
      context.lineTo(i, height * ((1 - min) / 2));
    }
    context.stroke();
  };

  return { render };
};
