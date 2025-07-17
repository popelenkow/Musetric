import { createGradient, parseHexColor } from '../../common';
import { Colors, Gradients } from '../colors';

export type CreateDrawerOptions = {
  canvas: HTMLCanvasElement;
  colors: Colors;
};

export type Drawer = {
  width: number;
  height: number;
  render: (view: Uint8Array, progress: number) => void;
  resize: () => void;
};

export const createDrawer = (options: CreateDrawerOptions): Drawer => {
  const { canvas, colors } = options;
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

  const drawer: Drawer = {
    width: 0,
    height: 0,
    resize: () => {
      drawer.width = canvas.clientWidth;
      drawer.height = canvas.clientHeight;
      image = context.createImageData(drawer.width, drawer.height);
    },
    render: (view, progress) => {
      const { width, height } = drawer;

      const played = Math.floor(progress * width);
      for (let x = 0; x < width; x++) {
        const columnOffset = x * height;
        for (let y = 0; y < height; y++) {
          const value = view[columnOffset + y];
          const idx = (y * width + x) * 4;
          const gradient = x < played ? gradients.played : gradients.unplayed;
          image.data[idx] = gradient.red[value];
          image.data[idx + 1] = gradient.green[value];
          image.data[idx + 2] = gradient.blue[value];
          image.data[idx + 3] = 255;
        }
      }

      canvas.width = width;
      canvas.height = height;
      context.putImageData(image, 0, 0);
    },
  };

  drawer.resize();
  return drawer;
};
