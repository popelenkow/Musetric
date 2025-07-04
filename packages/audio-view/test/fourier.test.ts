import { describe, expect, it } from 'vitest';
import { ComplexArray, fourierModes, fouriers } from '../src';
import { fourierFixtures } from './fixtures/fourier';

const getGpuDevice = async () => {
  const adapter = await navigator.gpu?.requestAdapter();
  if (!adapter) {
    throw new Error('WebGPU adapter not available');
  }
  const device = await adapter.requestDevice();
  return device;
};

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
  describe(mode, async () => {
    const device = await getGpuDevice();
    describe('forward', () => {
      fourierFixtures.forEach((fixture) => {
        it(fixture.name, async () => {
          const output: ComplexArray = {
            real: new Float32Array(fixture.windowSize),
            imag: new Float32Array(fixture.windowSize),
          };
          const fourier = await createFourier({
            windowSize: fixture.windowSize,
            windowCount: 1,
            device,
          });
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
          const fourier = await createFourier({
            windowSize: fixture.windowSize,
            windowCount: 1,
            device,
          });
          await fourier.inverse(fixture.output, output);
          assertArrayClose('real', output.real, fixture.input.real);
          assertArrayClose('imag', output.imag, fixture.input.imag);
        });
      });
    });
  });
});
