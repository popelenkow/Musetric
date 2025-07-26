import { CpuMarker, createGradient, parseHexColor } from '../../common';
import { Colors, Gradients } from '../colors';

export type Draw = {
  width: number;
  height: number;
  run: (view: Uint8Array, progress: number) => void;
  resize: () => void;
  configure: (colors: Colors) => void;
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
  let gradients: Gradients = undefined!;

  let image = context.createImageData(1, 1);

  const ref: Draw = {
    width: 0,
    height: 0,
    run: (view, progress) => {
      const { width, height } = ref;

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
    resize: () => {
      ref.width = canvas.clientWidth;
      ref.height = canvas.clientHeight;
      image = context.createImageData(ref.width, ref.height);
    },
    configure: (colors) => {
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
