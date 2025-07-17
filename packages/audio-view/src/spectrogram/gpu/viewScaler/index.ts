import { createBindGroup } from './bindGroup';
import { createBuffers, ViewScalerParams } from './buffers';
import { createPipeline } from './pipeline';

const workgroupSize = 16;

export type ViewScaler = {
  run: (
    encoder: GPUCommandEncoder,
    magnitude: GPUBuffer,
    texture: GPUTextureView,
  ) => void;
  writeParams: (params: ViewScalerParams) => void;
  destroy: () => void;
};

export const createViewScaler = (
  device: GPUDevice,
  timestampWrites?: GPUComputePassTimestampWrites,
): ViewScaler => {
  const pipeline = createPipeline(device);
  const buffers = createBuffers(device);

  return {
    run: (encoder, magnitude, texture) => {
      const { width, height } = buffers.paramsValue;
      const xGroups = Math.ceil(width / workgroupSize);
      const yGroups = Math.ceil(height / workgroupSize);

      const bindGroup = createBindGroup(
        device,
        pipeline,
        magnitude,
        buffers,
        texture,
      );
      const pass = encoder.beginComputePass({
        label: 'drawer-column-pass',
        timestampWrites,
      });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.dispatchWorkgroups(xGroups, yGroups);
      pass.end();
    },
    writeParams: buffers.writeParams,
    destroy: () => {
      buffers.destroy();
    },
  };
};
