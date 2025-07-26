import { Colors } from '../../colors';
import { createColors } from './colors';
import { createPipeline } from './pipeline';

export type Draw = {
  run: (encoder: GPUCommandEncoder) => void;
  configure: (
    view: GPUTextureView,
    progress: GPUBuffer,
    colors: Colors,
  ) => void;
  destroy: () => void;
};
export const createDraw = (
  device: GPUDevice,
  canvas: HTMLCanvasElement,
  marker?: GPUComputePassTimestampWrites,
): Draw => {
  const context = canvas.getContext('webgpu');
  if (!context) {
    throw new Error('WebGPU context not available on the canvas');
  }

  const pipeline = createPipeline(device, context);
  const colors = createColors(device);
  const sampler = device.createSampler({
    label: 'draw-sampler',
    magFilter: 'nearest',
    minFilter: 'nearest',
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let bindGroup: GPUBindGroup = undefined!;

  const ref: Draw = {
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
        timestampWrites: marker,
      });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.draw(3);
      pass.end();
    },
    configure: (view, progress, colorsValue) => {
      bindGroup = device.createBindGroup({
        label: 'draw-bind-group',
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: colors.buffer } },
          { binding: 1, resource: { buffer: progress } },
          { binding: 2, resource: sampler },
          { binding: 3, resource: view },
        ],
      });
      colors.write(colorsValue);
    },
    destroy: () => {
      colors.destroy();
    },
  };

  return ref;
};
