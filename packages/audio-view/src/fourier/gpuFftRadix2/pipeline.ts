import { Buffers } from './buffers';
import shaderCode from './index.wgsl?raw';

export const createPipeline = (device: GPUDevice) => {
  const module = device.createShaderModule({
    label: 'fft2-shader',
    code: shaderCode,
  });
  const pipeline = device.createComputePipeline({
    label: 'fft2-pipeline',
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });
  return pipeline;
};

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
