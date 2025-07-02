import { describe, it } from 'vitest';
import { ComplexArray, createFftRadix4 } from '../src';
import { assertArrayClose, fftFixtures } from './fixtures/fftFixtures';

describe('createFftRadix4', () => {
  describe('forward', () => {
    fftFixtures.forEach((fixture) => {
      it(fixture.name, () => {
        const output: ComplexArray = {
          real: new Float32Array(fixture.windowSize),
          imag: new Float32Array(fixture.windowSize),
        };
        createFftRadix4(fixture.windowSize).forward(fixture.input, output);
        assertArrayClose('real', output.real, fixture.output.real);
        assertArrayClose('imag', output.imag, fixture.output.imag);
      });
    });
  });

  describe('inverse', () => {
    fftFixtures.forEach((fixture) => {
      it(fixture.name, () => {
        const output: ComplexArray = {
          real: new Float32Array(fixture.windowSize),
          imag: new Float32Array(fixture.windowSize),
        };
        const fft = createFftRadix4(fixture.windowSize);
        fft.inverse(fixture.output, output);
        assertArrayClose('real', output.real, fixture.input.real);
        assertArrayClose('imag', output.imag, fixture.input.imag);
      });
    });
  });
});
