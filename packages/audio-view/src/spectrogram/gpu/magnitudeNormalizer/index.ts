import { ComplexGpuBuffer } from '../../../common';
import { createBindGroup } from './bindGroup';
import { createBuffers, MagnitudeNormalizerParams } from './buffers';
import { createPipeline } from './pipeline';

const workgroupSize = 64;

export type MagnitudeNormalizer = {
  run: (encoder: GPUCommandEncoder, signal: ComplexGpuBuffer) => void;
  writeParams: (params: MagnitudeNormalizerParams) => void;
  destroy: () => void;
};

export const createMagnitudeNormalizer = (
  device: GPUDevice,
  timestampWrites?: GPUComputePassTimestampWrites,
): MagnitudeNormalizer => {
  const pipeline = createPipeline(device);
  const buffers = createBuffers(device);

  return {
    run: (encoder, signal) => {
      const { windowSize, windowCount } = buffers.paramsValue;
      const halfSize = Math.ceil(windowSize / 2);
      const xCount = Math.ceil(halfSize / workgroupSize);

      const bindGroup = createBindGroup(device, pipeline, buffers, signal);
      const pass = encoder.beginComputePass({
        label: 'magnitude-normalizer-pass',
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
