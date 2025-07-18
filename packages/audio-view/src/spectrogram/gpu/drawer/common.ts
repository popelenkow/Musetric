import { Buffers } from './buffers';

export const createSampler = (device: GPUDevice) =>
  device.createSampler({
    label: 'drawer-sampler',
    magFilter: 'nearest',
    minFilter: 'nearest',
  });

export const createTexture = (
  device: GPUDevice,
  width: number,
  height: number,
) => {
  const instance = device.createTexture({
    label: 'drawer-texture',
    size: { width, height },
    format: 'rgba8unorm',
    usage:
      GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.COPY_DST |
      GPUTextureUsage.STORAGE_BINDING,
  });
  const view = instance.createView({
    label: 'drawer-texture-view',
  });
  return {
    instance,
    view,
    destroy: () => {
      instance.destroy();
    },
  };
};

export type BindGroupBuffers = {
  colorBuffer: GPUBuffer;
  progressBuffer: GPUBuffer;
  sampler: GPUSampler;
  texture: GPUTextureView;
};

export const createBindGroup = (
  device: GPUDevice,
  pipeline: GPURenderPipeline,
  buffers: Buffers,
  sampler: GPUSampler,
  texture: GPUTextureView,
) =>
  device.createBindGroup({
    label: 'drawer-bind-group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: buffers.colors } },
      { binding: 1, resource: { buffer: buffers.progress } },
      { binding: 2, resource: sampler },
      { binding: 3, resource: texture },
    ],
  });
