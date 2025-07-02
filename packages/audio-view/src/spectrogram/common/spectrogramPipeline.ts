import {
  ComplexArray,
  FourierMode,
  fouriers,
  normComplexArray,
} from '../../fourier';
import { calcMagnitudeToNormalizedDecibel } from './calcMagnitudeToNormalizedDecibel';
import { SpectrogramParameters } from './spectrogramParameters';

export type SpectrogramPipeline = {
  process: (input: Float32Array, output: Uint8Array[]) => Promise<void>;
};
export const createSpectrogramPipeline = async (
  parameters: SpectrogramParameters,
  width: number,
  height: number,
  mode: FourierMode,
): Promise<SpectrogramPipeline> => {
  const { sampleRate, windowSize, minFrequency, maxFrequency } = parameters;

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
    real: new Float32Array(windowSize * width),
    imag: new Float32Array(windowSize * width),
  };
  const magnitude = new Float32Array(fullBins);

  const wave: ComplexArray = {
    real: new Float32Array(windowSize * width),
    imag: new Float32Array(windowSize * width),
  };

  const fourier = await fouriers[mode](windowSize);

  return {
    process: async (input, output) => {
      const step = calcStep(input.length);

      for (let x = 0; x < width; x++) {
        const start = Math.floor(x * step);
        const slice = input.subarray(start, start + windowSize);
        wave.real.set(slice, x * windowSize);
        wave.imag.fill(0, x * windowSize, (x + 1) * windowSize);
      }

      await fourier.forward(wave, frequency);

      for (let x = 0; x < width; x++) {
        const slice: ComplexArray = {
          real: frequency.real.subarray(x * windowSize, (x + 1) * windowSize),
          imag: frequency.imag.subarray(x * windowSize, (x + 1) * windowSize),
        };
        normComplexArray(slice, magnitude);
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
