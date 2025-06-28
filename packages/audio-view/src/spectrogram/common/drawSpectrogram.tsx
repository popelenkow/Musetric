import { createFftRadix4 } from './fftRadix4';

export const drawSpectrogram = (
  canvas: HTMLCanvasElement,
  buffer: Float32Array,
  windowSize: number,
  cutoffRatio: number,
) => {
  const context = canvas.getContext('2d');
  if (!context) return;
  const height = canvas.clientHeight;
  const width = canvas.clientWidth;
  const fft = createFftRadix4(windowSize);
  const fullBins = windowSize / 2;
  const binsToShow = Math.floor(fullBins * cutoffRatio);

  const output = new Uint8Array(fullBins);
  const image = context.createImageData(width, height);
  const step = (buffer.length - windowSize) / width;

  for (let x = 0; x < width; x++) {
    const start = Math.floor(x * step);
    const slice = buffer.subarray(start, start + windowSize);
    fft.byteFrequency(slice, output);

    for (let y = 0; y < height; y++) {
      const binIndex = Math.floor((y / height) * binsToShow);
      const val = output[binsToShow - 1 - binIndex];
      const idx = (y * width + x) * 4;

      image.data[idx] = val;
      image.data[idx + 1] = val;
      image.data[idx + 2] = val;
      image.data[idx + 3] = 255;
    }
  }

  canvas.width = width;
  canvas.height = height;
  context.putImageData(image, 0, 0);
};
