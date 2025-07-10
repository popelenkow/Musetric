import { Buffers } from './buffers';

export const createBindGroup = (
  device: GPUDevice,
  pipeline: GPUComputePipeline,
  buffers: Buffers,
  magnitudes: GPUBuffer,
) =>
  device.createBindGroup({
    label: 'decibel-normalizer-bind-group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: magnitudes } },
      { binding: 1, resource: { buffer: buffers.params } },
    ],
  });
