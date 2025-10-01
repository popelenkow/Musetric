import { ComplexCpuBuffer, ComplexGpuBuffer } from '../complexArray.js';

export const readGpuBuffer = async (input: GPUBuffer): Promise<ArrayBuffer> => {
  await input.mapAsync(GPUMapMode.READ);
  const output = input.getMappedRange().slice();
  input.unmap();
  return output;
};

export const readComplexGpuBuffer = async (
  input: ComplexGpuBuffer,
): Promise<ComplexCpuBuffer> => {
  const [real, imag] = await Promise.all([
    readGpuBuffer(input.real),
    readGpuBuffer(input.imag),
  ]);
  return { real, imag };
};
