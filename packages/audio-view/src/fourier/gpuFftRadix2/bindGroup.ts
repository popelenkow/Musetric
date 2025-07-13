import { Buffers } from './buffers';

export const createBindGroup = (
  device: GPUDevice,
  pipeline: GPUComputePipeline,
  buffers: Buffers,
) =>
  device.createBindGroup({
    label: 'fft2-bind-group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: buffers.dataReal } },
      { binding: 1, resource: { buffer: buffers.dataImag } },
      { binding: 2, resource: { buffer: buffers.reverseTable } },
      { binding: 3, resource: { buffer: buffers.trigTable } },
      { binding: 4, resource: { buffer: buffers.params } },
    ],
  });
