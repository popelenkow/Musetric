import { Colors } from '../../colors';
import { Parameters } from '../../parameters';
import { createLogSlicer } from '../logSlicer';
import { createBuffers } from './buffers';
import { createBindGroup, createSampler, createTexture } from './common';
import { createPipeline } from './pipeline';

export type DrawerRender = (
  encoder: GPUCommandEncoder,
  magnitude: GPUBuffer,
  parameters: Parameters,
) => void;

export type Drawer = {
  width: number;
  height: number;
  resize: () => void;
  render: DrawerRender;
  destroy: () => void;
};

export const createDrawer = (
  canvas: HTMLCanvasElement,
  colors: Colors,
  windowSize: number,
  device: GPUDevice,
): Drawer => {
  const context = canvas.getContext('webgpu');
  if (!context) {
    throw new Error('WebGPU context not available on the canvas');
  }

  const pipeline = createPipeline(device, context);

  const buffers = createBuffers(device, colors);
  const sampler = createSampler(device);

  const logSlicer = createLogSlicer(device, windowSize);

  let texture = createTexture(device, 1, 1);

  let bindGroup = createBindGroup(
    device,
    pipeline,
    buffers,
    sampler,
    texture.view,
  );

  const drawer: Drawer = {
    width: 0,
    height: 0,
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
    render: (encoder, magnitude, parameters) => {
      const { width, height } = drawer;
      const { progress } = parameters;

      logSlicer.run(
        encoder,
        magnitude,
        parameters,
        { width, height },
        texture.view,
      );

      buffers.writeProgress(progress);
      const view = context.getCurrentTexture().createView();
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
      });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.draw(3);
      pass.end();
    },
    destroy: () => {
      texture.destroy();
      buffers.destroy();
      logSlicer.destroy();
    },
  };

  drawer.resize();
  return drawer;
};
