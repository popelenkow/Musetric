import { ComplexGpuBuffer } from '../../../common';
import { Buffers } from './buffers';

export const createBindGroup = (
  device: GPUDevice,
  pipeline: GPUComputePipeline,
  buffers: Buffers,
  input: ComplexGpuBuffer,
  output: GPUBuffer,
) =>
  device.createBindGroup({
    label: 'magnitude-normalizer-bind-group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: input.real } },
      { binding: 1, resource: { buffer: input.imag } },
      { binding: 2, resource: { buffer: output } },
      { binding: 3, resource: { buffer: buffers.params } },
    ],
  });
