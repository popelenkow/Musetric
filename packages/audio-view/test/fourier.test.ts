import { afterAll, describe, expect, it } from 'vitest';
import {
  ComplexArray,
  complexArrayFrom,
  CpuFourierMode,
  cpuFouriers,
  createComplexArray,
  createComplexGpuBufferReader,
  GpuFourierMode,
  gpuFouriers,
} from '../src';
import { fourierFixtures } from './fixtures/fourier';

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const cpuFourierModes = Object.keys(cpuFouriers) as CpuFourierMode[];
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const gpuFourierModes = Object.keys(gpuFouriers) as GpuFourierMode[];

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

describe('fourier', () => {
  for (const mode of cpuFourierModes) {
    describe(mode, () => {
      for (const fixture of fourierFixtures) {
        describe(fixture.name, async () => {
          const output = createComplexArray(fixture.windowSize);
          const createFourier = cpuFouriers[mode];
          const fourier = await createFourier({
            windowSize: fixture.windowSize,
          });

          it('forward', async () => {
            const fixtureInput: ComplexArray = {
              real: fixture.input,
              imag: new Float32Array(fixture.windowSize).fill(0),
            };
            await fourier.forward(fixtureInput, output);
            assertArrayClose('real', output.real, fixture.output.real);
            assertArrayClose('imag', output.imag, fixture.output.imag);
          });

          it('inverse', async () => {
            const fixtureInput: ComplexArray = {
              real: fixture.input,
              imag: new Float32Array(fixture.windowSize).fill(0),
            };
            await fourier.inverse(fixture.output, output);
            assertArrayClose('real', output.real, fixtureInput.real);
            assertArrayClose('imag', output.imag, fixtureInput.imag);
          });

          afterAll(() => {
            fourier.destroy();
          });
        });
      }
    });
  }

  for (const mode of gpuFourierModes) {
    describe(mode, () => {
      for (const fixture of fourierFixtures) {
        describe(fixture.name, async () => {
          const adapter = await navigator.gpu?.requestAdapter();
          if (!adapter) throw new Error('WebGPU adapter not available');
          const device = await adapter.requestDevice();

          const createFourier = gpuFouriers[mode];
          const fourier = await createFourier({
            device,
            windowSize: fixture.windowSize,
            windowCount: 1,
          });
          const reader = createComplexGpuBufferReader({
            device,
            typeSize: Float32Array.BYTES_PER_ELEMENT,
            size: fixture.windowSize,
          });

          it('forward', async () => {
            const encoder = device.createCommandEncoder();
            const fixtureInput: ComplexArray = {
              real: fixture.input,
              imag: new Float32Array(fixture.windowSize).fill(0),
            };
            const buffer = fourier.forward(encoder, fixtureInput);
            const command = encoder.finish();
            device.queue.submit([command]);
            await device.queue.onSubmittedWorkDone();
            const outputBuffer = await reader.read(buffer);
            const result = complexArrayFrom(outputBuffer);
            assertArrayClose('real', result.real, fixture.output.real);
            assertArrayClose('imag', result.imag, fixture.output.imag);
          });

          afterAll(() => {
            fourier.destroy();
            reader.destroy();
          });
        });
      }
    });
  }
});
