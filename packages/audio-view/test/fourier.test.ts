import { describe, expect, it } from 'vitest';
import {
  ComplexArray,
  createFftRadix4Gpu,
  fourierModes,
  fouriers,
} from '../src';
import { fourierFixtures } from './fixtures/fourier';

export const assertArrayClose = (
  name: string,
  received: Float32Array,
  expected: Float32Array,
) => {
  expect(received.length, `${name} length`).toBe(expected.length);
  for (let i = 0; i < expected.length; i++) {
    expect(received[i], `${name} index ${i}`).toBeCloseTo(expected[i], 1.5);
  }
};

fourierModes.forEach((mode) => {
  const createFourier = fouriers[mode];
  describe(mode, () => {
    describe('forward', () => {
      fourierFixtures.forEach((fixture) => {
        it(fixture.name, async () => {
          const output: ComplexArray = {
            real: new Float32Array(fixture.windowSize),
            imag: new Float32Array(fixture.windowSize),
          };
          const fourier = await createFourier(fixture.windowSize);
          await fourier.forward(fixture.input, output);
          assertArrayClose('real', output.real, fixture.output.real);
          assertArrayClose('imag', output.imag, fixture.output.imag);
        });
      });
    });

    describe('inverse', () => {
      fourierFixtures.forEach((fixture) => {
        it(fixture.name, async () => {
          const output: ComplexArray = {
            real: new Float32Array(fixture.windowSize),
            imag: new Float32Array(fixture.windowSize),
          };
          const fft = await createFftRadix4Gpu(fixture.windowSize);
          await fft.inverse(fixture.output, output);
          assertArrayClose('real', output.real, fixture.input.real);
          assertArrayClose('imag', output.imag, fixture.input.imag);
        });
      });
    });
  });
});
