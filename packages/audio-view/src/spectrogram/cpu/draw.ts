import {
  CpuMarker,
  createGradient,
  parseHexColor,
  ViewColors,
  ViewGradients,
  ViewSize,
} from '../../common';

export type Draw = {
  run: (view: Uint8Array) => void;
  configure: (
    viewSize: ViewSize,
    colors: ViewColors,
    visibleTimeBefore: number,
    visibleTimeAfter: number,
  ) => void;
};

export const createDraw = (
  canvas: HTMLCanvasElement,
  marker?: CpuMarker,
): Draw => {
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Context 2D not available on the canvas');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let gradients: ViewGradients = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let image: ImageData = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let viewSize: ViewSize = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let progress: number = undefined!;

  const ref: Draw = {
    run: (view) => {
      const { width, height } = viewSize;
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
      context.putImageData(image, 0, 0);
    },
    configure: (newViewSize, colors, visibleTimeBefore, visibleTimeAfter) => {
      viewSize = newViewSize;
      image = context.createImageData(viewSize.width, viewSize.height);
      progress = visibleTimeBefore / (visibleTimeBefore + visibleTimeAfter);
      gradients = {
        played: createGradient(
          parseHexColor(colors.background),
          parseHexColor(colors.played),
        ),
        unplayed: createGradient(
          parseHexColor(colors.background),
          parseHexColor(colors.unplayed),
        ),
      };
    },
  };
  ref.run = marker?.(ref.run) ?? ref.run;
  return ref;
};
