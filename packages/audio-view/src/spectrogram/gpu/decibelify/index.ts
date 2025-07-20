import { createBindGroup } from './bindGroup';
import { createBuffers, DecibelifyParams } from './buffers';
import { createPipeline } from './pipeline';

export type Decibelify = {
  run: (encoder: GPUCommandEncoder, magnitudes: GPUBuffer) => void;
  writeParams: (params: DecibelifyParams) => void;
  destroy: () => void;
};

export const createDecibelify = (
  device: GPUDevice,
  timestampWrites?: GPUComputePassTimestampWrites,
): Decibelify => {
  const pipeline = createPipeline(device);
  const buffers = createBuffers(device);

  return {
    run: (encoder, magnitudes) => {
      const { windowCount } = buffers.paramsValue;
      const bindGroup = createBindGroup(device, pipeline, buffers, magnitudes);
      const pass = encoder.beginComputePass({
        label: 'decibelify-pass',
        timestampWrites,
      });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.dispatchWorkgroups(windowCount);
      pass.end();
    },
    writeParams: buffers.writeParams,
    destroy: () => {
      buffers.destroy();
    },
  };
};
