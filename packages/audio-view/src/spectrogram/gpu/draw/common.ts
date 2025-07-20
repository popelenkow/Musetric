import { Buffers } from './buffers';

export const createSampler = (device: GPUDevice) =>
  device.createSampler({
    label: 'draw-sampler',
    magFilter: 'nearest',
    minFilter: 'nearest',
  });

export const createTexture = (
  device: GPUDevice,
  width: number,
  height: number,
) => {
  const instance = device.createTexture({
    label: 'draw-texture',
    size: { width, height },
    format: 'rgba8unorm',
    usage:
      GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.COPY_DST |
      GPUTextureUsage.STORAGE_BINDING,
  });
  const view = instance.createView({
    label: 'draw-texture-view',
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
    label: 'draw-bind-group',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: buffers.colors } },
      { binding: 1, resource: { buffer: buffers.progress } },
      { binding: 2, resource: sampler },
      { binding: 3, resource: texture },
    ],
  });
