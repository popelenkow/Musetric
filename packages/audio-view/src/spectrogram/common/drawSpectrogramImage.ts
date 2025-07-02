import { SpectrogramGradients } from './gradients';

export const drawSpectrogramImage = (
  canvas: HTMLCanvasElement,
  columns: Uint8Array[],
  progress: number,
  gradients: SpectrogramGradients,
): void => {
  const context = canvas.getContext('2d');
  if (!context) return;
  const width = columns.length;
  const height = columns[0]?.length ?? 0;

  const image = context.createImageData(width, height);
  const playedWidth = Math.floor(Math.max(0, Math.min(progress, 1)) * width);

  for (let x = 0; x < width; x++) {
    const column = columns[x];
    for (let y = 0; y < height; y++) {
      const value = column[y];
      const idx = (y * width + x) * 4;
      const gradient = x < playedWidth ? gradients.played : gradients.unplayed;
      image.data[idx] = gradient.red[value];
      image.data[idx + 1] = gradient.green[value];
      image.data[idx + 2] = gradient.blue[value];
      image.data[idx + 3] = 255;
    }
  }

  canvas.width = width;
  canvas.height = height;
  context.putImageData(image, 0, 0);
};
