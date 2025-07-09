import shaderCode from './index.wgsl?raw';
import { IoBuffers } from './ioBuffers';
import { StaticBuffers } from './staticBuffers';

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
  buffers: StaticBuffers & IoBuffers,
) =>
  device.createBindGroup({
    label: 'fft2-bind-group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: buffers.inputReal } },
      { binding: 1, resource: { buffer: buffers.inputImag } },
      { binding: 2, resource: { buffer: buffers.outputReal } },
      { binding: 3, resource: { buffer: buffers.outputImag } },
      { binding: 4, resource: { buffer: buffers.reverseTable } },
      { binding: 5, resource: { buffer: buffers.trigTable } },
      { binding: 6, resource: { buffer: buffers.params } },
    ],
  });
