import { Buffers } from './buffers';

export const createReverseBindGroup = (
  device: GPUDevice,
  pipeline: GPUComputePipeline,
  buffers: Buffers,
) =>
  device.createBindGroup({
    label: 'fft4-reverse-bind-group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: buffers.inputReal } },
      { binding: 1, resource: { buffer: buffers.inputImag } },
      { binding: 2, resource: { buffer: buffers.outputReal } },
      { binding: 3, resource: { buffer: buffers.outputImag } },
      { binding: 4, resource: { buffer: buffers.reverseTable } },
      { binding: 5, resource: { buffer: buffers.params } },
    ],
  });

export const createTransformBindGroup = (
  device: GPUDevice,
  pipeline: GPUComputePipeline,
  buffers: Buffers,
) =>
  device.createBindGroup({
    label: 'fft4-transform-bind-group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: buffers.outputReal } },
      { binding: 1, resource: { buffer: buffers.outputImag } },
      { binding: 2, resource: { buffer: buffers.trigTable } },
      { binding: 3, resource: { buffer: buffers.params } },
    ],
  });
