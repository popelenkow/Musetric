import { ComplexGpuBuffer } from '../../../common';
import { createBindGroup } from './bindGroup';
import { createBuffers, MagnitudifyParams } from './buffers';
import { createPipeline } from './pipeline';

const workgroupSize = 64;

export type Magnitudify = {
  run: (encoder: GPUCommandEncoder, signal: ComplexGpuBuffer) => void;
  writeParams: (params: MagnitudifyParams) => void;
  destroy: () => void;
};

export const createMagnitudify = (
  device: GPUDevice,
  timestampWrites?: GPUComputePassTimestampWrites,
): Magnitudify => {
  const pipeline = createPipeline(device);
  const buffers = createBuffers(device);

  return {
    run: (encoder, signal) => {
      const { windowSize, windowCount } = buffers.paramsValue;
      const halfSize = Math.ceil(windowSize / 2);
      const xCount = Math.ceil(halfSize / workgroupSize);

      const bindGroup = createBindGroup(device, pipeline, buffers, signal);
      const pass = encoder.beginComputePass({
        label: 'magnitudify-pass',
        timestampWrites,
      });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.dispatchWorkgroups(xCount, windowCount);
      pass.end();
    },
    writeParams: buffers.writeParams,
    destroy: () => {
      buffers.destroy();
    },
  };
};
