import { ComplexGpuBuffer } from '../../common';
import { Buffers } from './buffers';

export const createReverseBindGroup = (
  device: GPUDevice,
  pipeline: GPUComputePipeline,
  buffers: Buffers,
  waves: ComplexGpuBuffer,
) =>
  device.createBindGroup({
    label: 'fft4-reverse-bind-group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: waves.real } },
      { binding: 1, resource: { buffer: waves.imag } },
      { binding: 2, resource: { buffer: buffers.reverseTable } },
      { binding: 3, resource: { buffer: buffers.params } },
    ],
  });

export const createTransformBindGroup = (
  device: GPUDevice,
  pipeline: GPUComputePipeline,
  buffers: Buffers,
  waves: ComplexGpuBuffer,
) =>
  device.createBindGroup({
    label: 'fft4-transform-bind-group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: waves.real } },
      { binding: 1, resource: { buffer: waves.imag } },
      { binding: 2, resource: { buffer: buffers.trigTable } },
      { binding: 3, resource: { buffer: buffers.params } },
    ],
  });
