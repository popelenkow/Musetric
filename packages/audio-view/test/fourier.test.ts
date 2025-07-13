import { afterAll, describe, expect, it } from 'vitest';
import {
  ComplexArray,
  complexArrayFrom,
  CpuFourierMode,
  cpuFouriers,
  createComplexArray,
  createComplexGpuBufferReader,
  FourierMode,
  fourierModes,
  GpuFourierMode,
  gpuFouriers,
  isGpuFourierMode,
} from '../src';
import { fourierFixtures } from './fixtures/fourier';

const getGpuDevice = async () => {
  const adapter = await navigator.gpu?.requestAdapter();
  if (!adapter) {
    throw new Error('WebGPU adapter not available');
  }
  const device = await adapter.requestDevice();
  return device;
};

const createCpuFourier = async (mode: CpuFourierMode, windowSize: number) => {
  const createFourier = cpuFouriers[mode];
  const output = createComplexArray(windowSize);
  const fourier = await createFourier({
    windowSize,
  });
  return {
    forward: async (input: ComplexArray) => {
      await fourier.forward(input, output);
      return output;
    },
    inverse: async (input: ComplexArray) => {
      await fourier.inverse(input, output);
      return output;
    },
    destroy: () => {
      fourier.destroy();
    },
  };
};

const createGpuFourier = async (mode: GpuFourierMode, windowSize: number) => {
  const createFourier = gpuFouriers[mode];
  const device = await getGpuDevice();
  const fourier = await createFourier({
    windowSize,
    windowCount: 1,
    device,
  });
  const reader = createComplexGpuBufferReader({
    device,
    typeSize: Float32Array.BYTES_PER_ELEMENT,
    size: windowSize,
  });

  return {
    forward: async (input: ComplexArray) => {
      const encoder = device.createCommandEncoder();
      const buffer = fourier.forward(encoder, input);
      device.queue.submit([encoder.finish()]);
      await device.queue.onSubmittedWorkDone();
      const outputBuffer = await reader.read(buffer);
      return complexArrayFrom(outputBuffer);
    },
    inverse: async (input: ComplexArray) => {
      const encoder = device.createCommandEncoder();
      const buffer = fourier.inverse(encoder, input);
      device.queue.submit([encoder.finish()]);
      await device.queue.onSubmittedWorkDone();
      const outputBuffer = await reader.read(buffer);
      return complexArrayFrom(outputBuffer);
    },
    destroy: () => {
      fourier.destroy();
      reader.destroy();
    },
  };
};

const createFourier = async (mode: FourierMode, windowSize: number) => {
  if (isGpuFourierMode(mode)) {
    return createGpuFourier(mode, windowSize);
  }
  return createCpuFourier(mode, windowSize);
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

describe('fourier', () => {
  fourierModes.forEach((mode) => {
    describe(mode, () => {
      fourierFixtures.forEach((fixture) => {
        describe(fixture.name, async () => {
          const fourier = await createFourier(mode, fixture.windowSize);
          it('forward', async () => {
            const result = await fourier.forward(fixture.input);
            assertArrayClose('real', result.real, fixture.output.real);
            assertArrayClose('imag', result.imag, fixture.output.imag);
          });
          it('inverse', async () => {
            const result = await fourier.inverse(fixture.output);
            assertArrayClose('real', result.real, fixture.input.real);
            assertArrayClose('imag', result.imag, fixture.input.imag);
          });
          afterAll(() => {
            fourier.destroy();
          });
        });
      });
    });
  });
});
