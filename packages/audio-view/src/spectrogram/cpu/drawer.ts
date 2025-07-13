import { Colors, createGradient, Gradients, parseHexColor } from '../colors';
import { Parameters } from '../parameters';
import { logSlice } from './logSlice';

export type DrawerRender = (
  magnitudes: Float32Array,
  progress: number,
  parameters: Parameters,
) => void;

export type Drawer = {
  width: number;
  height: number;
  resize: () => void;
  render: DrawerRender;
};

export type CreateDrawerOptions = {
  canvas: HTMLCanvasElement;
  colors: Colors;
  windowSize: number;
};

export const createDrawer = (options: CreateDrawerOptions): Drawer => {
  const { canvas, colors, windowSize } = options;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Context 2D not available on the canvas');
  }

  const gradients: Gradients = {
    played: createGradient(
      parseHexColor(colors.background),
      parseHexColor(colors.played),
    ),
    unplayed: createGradient(
      parseHexColor(colors.background),
      parseHexColor(colors.unplayed),
    ),
  };

  let image = context.createImageData(1, 1);
  let column = new Uint8Array(1);

  const drawer: Drawer = {
    width: 0,
    height: 0,
    resize: () => {
      drawer.width = canvas.clientWidth;
      drawer.height = canvas.clientHeight;
      image = context.createImageData(drawer.width, drawer.height);
      column = new Uint8Array(drawer.height);
    },
    render: (magnitudes, progress, parameters) => {
      const { width, height } = drawer;

      const playedWidth = Math.floor(
        Math.max(0, Math.min(progress, 1)) * width,
      );

      for (let x = 0; x < width; x++) {
        const start = x * windowSize;
        const end = start + windowSize;
        const magnitude = magnitudes.subarray(start / 2, end / 2);
        logSlice(windowSize, height, parameters, magnitude, column);
        for (let y = 0; y < height; y++) {
          const value = column[y];
          const idx = (y * width + x) * 4;
          const gradient =
            x < playedWidth ? gradients.played : gradients.unplayed;
          image.data[idx] = gradient.red[value];
          image.data[idx + 1] = gradient.green[value];
          image.data[idx + 2] = gradient.blue[value];
          image.data[idx + 3] = 255;
        }
      }

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      context.putImageData(image, 0, 0);
    },
  };

  drawer.resize();
  return drawer;
};
