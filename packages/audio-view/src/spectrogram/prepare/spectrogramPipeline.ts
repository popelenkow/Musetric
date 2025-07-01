import { ComplexArray, normComplexArray } from '../../common';
import { SpectrogramParameters } from '../common/spectrogramParameters';
import { createDftGpu, createFftRadix4 } from '../fourier';
import { calcMagnitudeToNormalizedDecibel } from './calcMagnitudeToNormalizedDecibel';

export type SpectrogramMode = 'cpu' | 'gpu';

export type SpectrogramPipeline = {
  process: (input: Float32Array, output: Uint8Array[]) => Promise<void>;
};
export const createSpectrogramPipeline = async (
  { sampleRate, windowSize, minFrequency, maxFrequency }: SpectrogramParameters,
  width: number,
  height: number,
  backend: SpectrogramMode,
): Promise<SpectrogramPipeline> => {
  const fullBins = windowSize / 2;
  const calcStep = (len: number) => (len - windowSize) / width;
  const maxBin = Math.min(
    Math.floor((maxFrequency / sampleRate) * windowSize),
    fullBins,
  );
  const minBin = Math.max(
    Math.floor((minFrequency / sampleRate) * windowSize),
    0,
  );
  const logMin = Math.log(minBin + 1);
  const logRange = Math.log(maxBin + 1) - logMin;

  const frequency: ComplexArray = {
    real: new Float32Array(windowSize),
    imag: new Float32Array(windowSize),
  };
  const magnitude = new Float32Array(fullBins);

  const wave: ComplexArray = {
    real: new Float32Array(windowSize),
    imag: new Float32Array(windowSize),
  };

  const fft =
    backend === 'gpu'
      ? await createDftGpu(windowSize)
      : createFftRadix4(windowSize);

  return {
    process: async (input, output) => {
      const step = calcStep(input.length);

      for (let x = 0; x < width; x++) {
        const start = Math.floor(x * step);
        const slice = input.subarray(start, start + windowSize);
        wave.real.set(slice);
        wave.imag.fill(0);
        await fft.forward(wave, frequency);
        normComplexArray(frequency, magnitude);
        calcMagnitudeToNormalizedDecibel(magnitude);

        const column = new Uint8Array(height);
        for (let y = 0; y < height; y++) {
          const ratio = 1 - y / (height - 1);
          const raw = Math.exp(logMin + logRange * ratio);
          const idx = Math.max(
            minBin,
            Math.min(Math.floor(raw) - 1, maxBin - 1),
          );
          column[y] = Math.round(magnitude[idx] * 255);
        }
        output.push(column);
      }
    },
  };
};
