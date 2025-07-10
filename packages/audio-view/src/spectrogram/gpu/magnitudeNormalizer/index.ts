import { ComplexGpuBuffer } from '../../../common/gpuBuffer';
import { createBindGroup } from './bindGroup';
import { createBuffers } from './buffers';
import { createPipeline } from './pipeline';

export type MagnitudeNormalizerRun = (
  encoder: GPUCommandEncoder,
  input: ComplexGpuBuffer,
  output: GPUBuffer,
  windowCount: number,
) => void;

export type MagnitudeNormalizer = {
  run: MagnitudeNormalizerRun;
  destroy: () => void;
};

export const createMagnitudeNormalizer = (
  device: GPUDevice,
  windowSize: number,
): MagnitudeNormalizer => {
  const pipeline = createPipeline(device);
  const buffers = createBuffers(device);

  return {
    run: (encoder, input, output, windowCount) => {
      buffers.writeParams({ windowSize, windowCount });
      const bindGroup = createBindGroup(
        device,
        pipeline,
        buffers,
        input,
        output,
      );

      const pass = encoder.beginComputePass({
        label: 'magnitude-normalizer-pass',
      });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      const workgroupSize = 64;
      const halfSize = Math.ceil(windowSize / 2);
      const xCount = Math.ceil(halfSize / workgroupSize);
      pass.dispatchWorkgroups(xCount, windowCount);
      pass.end();
    },
    destroy: () => {
      buffers.destroy();
    },
  };
};
