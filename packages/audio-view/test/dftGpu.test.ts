import { describe, it } from 'vitest';
import { ComplexArray, createDftGpu } from '../src';
import { assertArrayClose, fftFixtures } from './fixtures/fftFixtures';

describe('dftGpu', () => {
  describe('forward', () => {
    fftFixtures.forEach((fixture) => {
      it(fixture.name, async () => {
        const output: ComplexArray = {
          real: new Float32Array(fixture.windowSize),
          imag: new Float32Array(fixture.windowSize),
        };
        const dft = await createDftGpu(fixture.windowSize);
        await dft.forward(fixture.input, output);
        assertArrayClose('real', output.real, fixture.output.real);
        assertArrayClose('imag', output.imag, fixture.output.imag);
      });
    });
  });
});
