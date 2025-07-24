import { Colors } from '../../colors';
import { createColors } from './colors';
import { createPipeline } from './pipeline';
import { createProgress } from './progress';
import { createTexture } from './texture';

export type Draw = {
  width: number;
  height: number;
  getTextureView: () => GPUTextureView;
  run: (encoder: GPUCommandEncoder) => void;
  resize: () => void;
  configure: (colors: Colors) => void;
  writeProgress: (progress: number) => void;
  destroy: () => void;
};
export const createDraw = (
  device: GPUDevice,
  canvas: HTMLCanvasElement,
  timestampWrites?: GPUComputePassTimestampWrites
): Draw => {
  const context = canvas.getContext('webgpu');
  if (!context) {
    throw new Error('WebGPU context not available on the canvas');
  }

  const pipeline = createPipeline(device, context);
  const colors = createColors(device);
  const progress = createProgress(device);
  const sampler = device.createSampler({
    label: 'draw-sampler',
    magFilter: 'nearest',
    minFilter: 'nearest',
  });

  const texture = createTexture(device);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let bindGroup: GPUBindGroup = undefined!;

  const drawer: Draw = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    width: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    height: undefined!,
    getTextureView: () => texture.view,
    run: (encoder) => {
      const view = context.getCurrentTexture().createView({
        label: 'draw-view',
      });
      const pass = encoder.beginRenderPass({
        label: 'draw-pass',
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

      texture.resize(width, height);
      bindGroup = device.createBindGroup({
        label: 'draw-bind-group',
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: colors.buffer } },
          { binding: 1, resource: { buffer: progress.buffer } },
          { binding: 2, resource: sampler },
          { binding: 3, resource: texture.view },
        ],
      });
    },
    configure: (value) => {
      colors.write(value);
    },
    writeProgress: progress.write,
    destroy: () => {
      colors.destroy();
      progress.destroy();
      texture.destroy();
    },
  };

  return drawer;
};
