import { createBindGroup } from './bindGroup';
import { createBuffers, DecibelNormalizerParams } from './buffers';
import { createPipeline } from './pipeline';

export type DecibelNormalizer = {
  run: (encoder: GPUCommandEncoder, magnitudes: GPUBuffer) => void;
  writeParams: (params: DecibelNormalizerParams) => void;
  destroy: () => void;
};

export const createDecibelNormalizer = (
  device: GPUDevice,
  timestampWrites?: GPUComputePassTimestampWrites,
): DecibelNormalizer => {
  const pipeline = createPipeline(device);
  const buffers = createBuffers(device);

  return {
    run: (encoder, magnitudes) => {
      const { windowCount } = buffers.paramsValue;
      const bindGroup = createBindGroup(device, pipeline, buffers, magnitudes);
      const pass = encoder.beginComputePass({
        label: 'decibel-normalizer-pass',
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
