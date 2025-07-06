import { Colors, createGradient, Gradients, parseHexColor } from '../colors';

export type DrawerRender = (progress: number) => void;

export type Drawer = {
  width: number;
  height: number;
  columns: Uint8Array[];
  resize: () => void;
  render: DrawerRender;
};
export const createDrawer = (
  canvas: HTMLCanvasElement,
  colors: Colors,
): Drawer => {
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

  let image = context.createImageData(canvas.clientWidth, canvas.clientHeight);

  const resize = () => {
    drawer.width = canvas.clientWidth;
    drawer.height = canvas.clientHeight;
    image = context.createImageData(drawer.width, drawer.height);
    drawer.columns = Array.from(
      { length: drawer.width },
      () => new Uint8Array(drawer.height),
    );
  };

  const drawer: Drawer = {
    width: 0,
    height: 0,
    columns: [],
    resize,
    render: (progress) => {
      const { width, height, columns } = drawer;

      const playedWidth = Math.floor(
        Math.max(0, Math.min(progress, 1)) * width,
      );

      for (let x = 0; x < width; x++) {
        const column = columns[x];
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
  resize();

  return drawer;
};
