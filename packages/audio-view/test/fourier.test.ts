import { afterAll, describe, expect, it } from 'vitest';
import {
  ComplexArray,
  complexArrayFrom,
  CpuFourierMode,
  cpuFouriers,
  createComplexGpuBufferReader,
  createGpuContext,
  GpuFourierMode,
  gpuFouriers,
} from '../src';
import { fourierFixtures } from './fixtures/fourier';

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const cpuFourierModes = Object.keys(cpuFouriers) as CpuFourierMode[];
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const gpuFourierModes = Object.keys(gpuFouriers) as GpuFourierMode[];

const createGpuBuffers = (device: GPUDevice, windowSize: number) => {
  const createSignalBuffer = () => ({
    real: device.createBuffer({
      label: 'test-signal-real-buffer',
      size: windowSize * Float32Array.BYTES_PER_ELEMENT,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    }),
    imag: device.createBuffer({
      label: 'test-signal-imag-buffer',
      size: windowSize * Float32Array.BYTES_PER_ELEMENT,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    }),
  });

  const buffers = {
    signal: createSignalBuffer(),
    destroy: () => {
      buffers.signal.real.destroy();
      buffers.signal.imag.destroy();
    },
  };

  return buffers;
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

describe('fourier', async () => {
  const { device } = await createGpuContext();

  for (const mode of cpuFourierModes) {
    describe(mode, () => {
      for (const fixture of fourierFixtures) {
        describe(fixture.name, () => {
          const createFourier = cpuFouriers[mode];
          const fourier = createFourier({
            windowSize: fixture.windowSize,
          });

          it('forward', () => {
            const zeroImag = new Float32Array(fixture.windowSize).fill(0);
            const signal: ComplexArray = {
              real: fixture.input.slice(),
              imag: zeroImag,
            };
            fourier.forward(signal, 1);
            assertArrayClose('real', signal.real, fixture.output.real);
            assertArrayClose('imag', signal.imag, fixture.output.imag);
          });

          it('inverse', () => {
            const zeroImag = new Float32Array(fixture.windowSize).fill(0);
            const signal: ComplexArray = {
              real: fixture.output.real.slice(),
              imag: fixture.output.imag.slice(),
            };
            fourier.inverse(signal, 1);
            assertArrayClose('real', signal.real, fixture.input);
            assertArrayClose('imag', signal.imag, zeroImag);
          });
        });
      }
    });
  }

  for (const mode of gpuFourierModes) {
    describe(mode, () => {
      for (const fixture of fourierFixtures) {
        describe(fixture.name, async () => {
          const createFourier = gpuFouriers[mode];
          const fourier = await createFourier({
            device,
            windowSize: fixture.windowSize,
          });
          fourier.writeParams({
            windowSize: fixture.windowSize,
            windowCount: 1,
          });
          const reader = createComplexGpuBufferReader({
            device,
            typeSize: Float32Array.BYTES_PER_ELEMENT,
            size: fixture.windowSize,
          });
          const buffers = createGpuBuffers(device, fixture.windowSize);

          it('forward', async () => {
            const zeroImag = new Float32Array(fixture.windowSize).fill(0);
            device.queue.writeBuffer(buffers.signal.real, 0, fixture.input);
            device.queue.writeBuffer(buffers.signal.imag, 0, zeroImag);
            const encoder = device.createCommandEncoder();
            fourier.forward(encoder, buffers.signal);
            const command = encoder.finish();
            device.queue.submit([command]);
            await device.queue.onSubmittedWorkDone();
            const outputBuffer = await reader.read(buffers.signal);
            const result = complexArrayFrom(outputBuffer);
            assertArrayClose('real', result.real, fixture.output.real);
            assertArrayClose('imag', result.imag, fixture.output.imag);
          });

          afterAll(() => {
            fourier.destroy();
            reader.destroy();
            buffers.destroy();
          });
        });
      }
    });
  }
});
