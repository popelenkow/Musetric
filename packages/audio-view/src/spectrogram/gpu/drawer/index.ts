import { Colors } from '../../colors';
import { createBuffers } from './buffers';
import { createBindGroup, createSampler, createTexture } from './common';
import { createPipeline } from './pipeline';

export type Drawer = {
  render: (encoder: GPUCommandEncoder) => void;
  resize: () => void;
  writeProgress: (progress: number) => void;
  width: number;
  height: number;
  getTextureView: () => GPUTextureView;
  destroy: () => void;
};

export type CreateDrawerOptions = {
  device: GPUDevice;
  canvas: HTMLCanvasElement;
  colors: Colors;
  timestampWrites?: GPUComputePassTimestampWrites;
};

export const createDrawer = (options: CreateDrawerOptions): Drawer => {
  const { device, canvas, colors, timestampWrites } = options;
  const context = canvas.getContext('webgpu');
  if (!context) {
    throw new Error('WebGPU context not available on the canvas');
  }

  const pipeline = createPipeline(device, context);

  const buffers = createBuffers(device, colors);
  const sampler = createSampler(device);

  let texture = createTexture(device, 1, 1);

  let bindGroup = createBindGroup(
    device,
    pipeline,
    buffers,
    sampler,
    texture.view,
  );

  const drawer: Drawer = {
    render: (encoder) => {
      const view = context.getCurrentTexture().createView({
        label: 'drawer-output-view',
      });
      const pass = encoder.beginRenderPass({
        label: 'drawer-pass',
        colorAttachments: [
          {
            view,
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: 'clear',
            storeOp: 'store',
          },
        ],
        timestampWrites,
      });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.draw(3);
      pass.end();
    },
    resize: () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      drawer.width = width;
      drawer.height = height;
      canvas.width = width;
      canvas.height = height;

      texture.destroy();
      texture = createTexture(device, width, height);
      bindGroup = createBindGroup(
        device,
        pipeline,
        buffers,
        sampler,
        texture.view,
      );
    },
    writeProgress: buffers.writeProgress,
    width: 0,
    height: 0,
    getTextureView: () => texture.view,

    destroy: () => {
      texture.destroy();
      buffers.destroy();
    },
  };

  drawer.resize();
  return drawer;
};
