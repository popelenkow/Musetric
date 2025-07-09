import { cpu } from '../..';
import { Colors } from '../../colors';
import { Parameters } from '../../parameters';
import {
  createBindGroup,
  createColorBuffer,
  createProgressBuffer,
  createSampler,
  createTexture,
} from './common';
import fragmentCode from './fragment.wgsl?raw';
import vertexCode from './vertex.wgsl?raw';

export type DrawerRender = (
  magnitudes: Float32Array,
  progress: number,
  parameters: Parameters,
) => Promise<void>;

export type Drawer = {
  width: number;
  height: number;
  resize: () => void;
  render: DrawerRender;
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
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format });

  const vertexModule = device.createShaderModule({ code: vertexCode });
  const fragmentModule = device.createShaderModule({ code: fragmentCode });

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: { module: vertexModule, entryPoint: 'main' },
    fragment: {
      module: fragmentModule,
      entryPoint: 'main',
      targets: [{ format }],
    },
    primitive: { topology: 'triangle-list' },
  });

  const colorBuffer = createColorBuffer(device, colors);
  const progressBuffer = createProgressBuffer(device);
  const sampler = createSampler(device);

  let texture = createTexture(device, 1, 1);

  let bindGroup = createBindGroup(device, pipeline, {
    colorBuffer,
    progressBuffer,
    sampler,
    texture: texture.view,
  });

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
      bindGroup = createBindGroup(device, pipeline, {
        colorBuffer,
        progressBuffer,
        sampler,
        texture: texture.view,
      });
    },
    render: async (magnitudes, progress, parameters) => {
      const { width, height } = drawer;
      for (let x = 0; x < width; x++) {
        const start = x * windowSize;
        const end = start + windowSize;
        const magnitude = magnitudes.subarray(start / 2, end / 2);
        cpu.computeColumn(
          windowSize,
          height,
          parameters,
          magnitude,
          texture.column,
        );
        for (let y = 0; y < height; y++) {
          texture.columns[y * width + x] = texture.column[y];
        }
      }
      device.queue.writeTexture(
        { texture: texture.instance },
        texture.columns,
        { bytesPerRow: width },
        { width, height, depthOrArrayLayers: 1 },
      );

      const clamped = Math.max(0, Math.min(progress, 1));
      device.queue.writeBuffer(progressBuffer, 0, new Float32Array([clamped]));

      const encoder = device.createCommandEncoder();
      const view = context.getCurrentTexture().createView();
      const pass = encoder.beginRenderPass({
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
      device.queue.submit([encoder.finish()]);
      await device.queue.onSubmittedWorkDone();
    },
  };

  drawer.resize();
  return drawer;
};
