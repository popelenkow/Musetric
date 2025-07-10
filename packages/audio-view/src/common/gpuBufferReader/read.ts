import { ComplexArray } from '../complexArray';
import { ComplexGpuBuffer } from '../gpuBuffer';

export const readGpuBuffer = async (
  input: GPUBuffer,
  output: Float32Array,
): Promise<void> => {
  await input.mapAsync(GPUMapMode.READ);
  const array = new Float32Array(input.getMappedRange());
  output.set(array);
  input.unmap();
};

export const readComplexGpuBuffer = async (
  input: ComplexGpuBuffer,
  output: ComplexArray,
): Promise<void> => {
  await Promise.all([
    readGpuBuffer(input.real, output.real),
    readGpuBuffer(input.imag, output.imag),
  ]);
};
