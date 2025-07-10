import { Colors, parseHexColor } from '../../colors';

const toVec4 = (hex: string): [number, number, number, number] => {
  const { red, green, blue } = parseHexColor(hex);
  return [red / 255, green / 255, blue / 255, 1];
};

export const createColorBuffer = (device: GPUDevice, colors: Colors) => {
  const colorData = new Float32Array([
    ...toVec4(colors.played),
    ...toVec4(colors.unplayed),
    ...toVec4(colors.background),
  ]);
  const buffer = device.createBuffer({
    label: 'drawer-colors',
    size: colorData.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, colorData);
  return buffer;
};

export const createProgressBuffer = (device: GPUDevice) =>
  device.createBuffer({
    label: 'drawer-progress',
    size: 4,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

export const createSampler = (device: GPUDevice) =>
  device.createSampler({
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
    format: 'r8unorm',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
  });
  const view = instance.createView();
  const columns = new Uint8Array(width * height);
  const column = new Uint8Array(height);
  return {
    instance,
    view,
    columns,
    column,
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
  buffers: BindGroupBuffers,
) =>
  device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: buffers.colorBuffer } },
      { binding: 1, resource: { buffer: buffers.progressBuffer } },
      { binding: 2, resource: buffers.sampler },
      { binding: 3, resource: buffers.texture },
    ],
  });
