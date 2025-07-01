import { createFftRadix4 } from './fftRadix4';
import { SpectrogramGradients } from './gradients';
import { SpectrogramParameters } from './spectrogramParameters';

export const drawSpectrogram = (
  canvas: HTMLCanvasElement,
  buffer: Float32Array,
  parameters: SpectrogramParameters,
  progress: number,
  gradients: SpectrogramGradients,
) => {
  const context = canvas.getContext('2d');
  if (!context) return;
  const height = canvas.clientHeight;
  const width = canvas.clientWidth;

  const { sampleRate, windowSize, minFrequency, maxFrequency } = parameters;
  const fft = createFftRadix4(windowSize);
  const fullBins = windowSize / 2;

  const maxBin = Math.min(
    Math.floor((maxFrequency / sampleRate) * windowSize),
    fullBins,
  );
  const minBin = Math.max(
    Math.floor((minFrequency / sampleRate) * windowSize),
    0,
  );

  const output = new Uint8Array(fullBins);
  const image = context.createImageData(width, height);
  const step = (buffer.length - windowSize) / width;
  const logMin = Math.log(minBin + 1);
  const logMax = Math.log(maxBin + 1);
  const playedWidth = Math.floor(Math.max(0, Math.min(progress, 1)) * width);
  const logRange = logMax - logMin;

  for (let x = 0; x < width; x++) {
    const start = Math.floor(x * step);
    const slice = buffer.subarray(start, start + windowSize);
    fft.byteFrequency(slice, output);

    for (let y = 0; y < height; y++) {
      const ratio = 1 - y / (height - 1);
      const raw = Math.exp(logMin + logRange * ratio);
      const binIndex = Math.max(
        minBin,
        Math.min(Math.floor(raw) - 1, maxBin - 1),
      );
      const val = output[binIndex];
      const idx = (y * width + x) * 4;
      const gradient = x < playedWidth ? gradients.played : gradients.unplayed;

      image.data[idx] = gradient.red[val];
      image.data[idx + 1] = gradient.green[val];
      image.data[idx + 2] = gradient.blue[val];
      image.data[idx + 3] = 255;
    }
  }

  canvas.width = width;
  canvas.height = height;
  context.putImageData(image, 0, 0);
};
