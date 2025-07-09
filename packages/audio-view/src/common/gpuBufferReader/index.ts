import { ComplexArray } from '../complexArray';
import { ComplexGpuBuffer } from '../gpuBuffer';
import { copyGpuBuffer, copyComplexGpuBuffer } from './copy';
import { createGpuBuffer, createComplexGpuBuffer } from './create';
import { readGpuBuffer, readComplexGpuBuffer } from './read';

export type CreateGpuBufferReaderOptions = {
  device: GPUDevice;
  typeSize: number;
  size: number;
};

export type GpuBufferReader = {
  read: (input: GPUBuffer, output: Float32Array) => Promise<void>;
  resize: (size: number) => void;
  destroy: () => void;
};
export const createGpuBufferReader = (
  options: CreateGpuBufferReaderOptions,
): GpuBufferReader => {
  const { device, typeSize } = options;
  let size = options.size;
  let buffer = createGpuBuffer(device, size * typeSize);

  return {
    read: async (input: GPUBuffer, output: Float32Array) => {
      await copyGpuBuffer(device, input, buffer, size * typeSize);
      await readGpuBuffer(buffer, output);
    },
    resize: (newSize: number) => {
      size = newSize;
      buffer.destroy();
      buffer = createGpuBuffer(device, newSize * typeSize);
    },
    destroy: () => buffer.destroy(),
  };
};

export type ComplexGpuBufferReader = {
  read: (input: ComplexGpuBuffer, output: ComplexArray) => Promise<void>;
  resize: (size: number) => void;
  destroy: () => void;
};

export const createComplexGpuBufferReader = (
  options: CreateGpuBufferReaderOptions,
): ComplexGpuBufferReader => {
  const { device, typeSize } = options;
  let size = options.size;
  let buffer = createComplexGpuBuffer(device, size * typeSize);

  return {
    read: async (input: ComplexGpuBuffer, output: ComplexArray) => {
      await copyComplexGpuBuffer(device, input, buffer, size * typeSize);
      await readComplexGpuBuffer(buffer, output);
    },
    resize: (newSize: number) => {
      size = newSize;
      buffer.real.destroy();
      buffer.imag.destroy();
      buffer = createComplexGpuBuffer(device, size * typeSize);
    },
    destroy: () => {
      buffer.real.destroy();
      buffer.imag.destroy();
    },
  };
};
