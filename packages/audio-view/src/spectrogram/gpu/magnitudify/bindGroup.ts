import { ComplexGpuBuffer } from '../../../common';
import { Buffers } from './buffers';

export const createBindGroup = (
  device: GPUDevice,
  pipeline: GPUComputePipeline,
  buffers: Buffers,
  signal: ComplexGpuBuffer,
) =>
  device.createBindGroup({
    label: 'magnitudify-bind-group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: signal.real } },
      { binding: 1, resource: { buffer: signal.imag } },
      { binding: 2, resource: { buffer: buffers.params } },
    ],
  });
