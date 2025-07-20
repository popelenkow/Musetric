import { Buffers } from './buffers';

export const createBindGroup = (
  device: GPUDevice,
  pipeline: GPUComputePipeline,
  buffers: Buffers,
  signal: GPUBuffer,
) =>
  device.createBindGroup({
    label: 'filter-wave-bind-group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: signal } },
      { binding: 1, resource: { buffer: buffers.params } },
      { binding: 2, resource: { buffer: buffers.coefficients } },
    ],
  });
