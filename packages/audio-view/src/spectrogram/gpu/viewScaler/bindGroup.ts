import { Buffers } from './buffers';

export const createBindGroup = (
  device: GPUDevice,
  pipeline: GPUComputePipeline,
  magnitude: GPUBuffer,
  buffers: Buffers,
  texture: GPUTextureView,
) =>
  device.createBindGroup({
    label: 'drawer-column-bind-group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: magnitude } },
      { binding: 1, resource: texture },
      { binding: 2, resource: { buffer: buffers.params } },
    ],
  });
