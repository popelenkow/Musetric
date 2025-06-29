import { ComplexArray, normComplexArray } from '../../common';
import { calcMagnitudeToNormalizedDecibel } from './calcMagnitudeToNormalizedDecibel';
import { gaussWindowFilter } from './windowFilters';

export type SpectrometerBase = {
  forward: (input: ComplexArray, output: ComplexArray) => void;
  inverse: (input: ComplexArray, output: ComplexArray) => void;
};

export type Spectrometer = SpectrometerBase & {
  frequency: (input: Float32Array, output: Float32Array) => void;
  byteFrequency: (input: Float32Array, output: Uint8Array) => void;
};
export const createSpectrometer = (
  windowSize: number,
  base: SpectrometerBase,
): Spectrometer => {
  const { forward, inverse } = base;
  const window: ComplexArray = {
    real: new Float32Array(windowSize),
    imag: new Float32Array(windowSize),
  };
  const buffer = new Float32Array(windowSize / 2);
  const frequency: ComplexArray = {
    real: new Float32Array(windowSize),
    imag: new Float32Array(windowSize),
  };
  const filter = gaussWindowFilter(windowSize);

  const api: Spectrometer = {
    forward,
    inverse,
    frequency: (input, output) => {
      for (let i = 0; i < windowSize; i++) {
        window.real[i] = input[i] * filter[i];
        window.imag[i] = 0;
      }
      forward(window, frequency);
      normComplexArray(frequency, output);
      calcMagnitudeToNormalizedDecibel(output);
    },
    byteFrequency: (input, output) => {
      api.frequency(input, buffer);
      for (let j = 0; j < windowSize / 2; j++) {
        output[j] = Math.round(buffer[j] * 255);
      }
    },
  };
  return api;
};
