import { createBindGroup } from './bindGroup';
import { createBuffers } from './buffers';
import { createPipeline } from './pipeline';

export type DecibelNormalizerRun = (
  encoder: GPUCommandEncoder,
  magnitudes: GPUBuffer,
  windowCount: number,
  minDecibel?: number,
) => void;

export type DecibelNormalizer = {
  run: DecibelNormalizerRun;
  destroy: () => void;
};

export type CreateDecibelNormalizerOptions = {
  device: GPUDevice;
  windowSize: number;
  timestampWrites?: GPUComputePassTimestampWrites;
};

export const createDecibelNormalizer = (
  options: CreateDecibelNormalizerOptions,
): DecibelNormalizer => {
  const { device, windowSize, timestampWrites } = options;
  const pipeline = createPipeline(device);
  const buffers = createBuffers(device);

  return {
    run: (encoder, magnitudes, windowCount, minDecibel = -40) => {
      const halfSize = windowSize / 2;
      buffers.writeParams({ halfSize, windowCount, minDecibel });
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
    destroy: () => {
      buffers.destroy();
    },
  };
};
