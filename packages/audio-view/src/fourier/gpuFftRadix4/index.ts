import { ComplexGpuBuffer } from '../../common';
import { CreateGpuFourier, GpuFourier } from '../gpuFourier';
import { assertWindowSizePowerOfTwo } from '../isPowerOfTwo';
import { createReverseBindGroup, createTransformBindGroup } from './bindGroup';
import { createBuffers } from './buffers';
import { createReversePipeline, createTransformPipeline } from './pipeline';

export const createGpuFftRadix4: CreateGpuFourier = async (options) => {
  const { windowSize, device, timestampWrites } = options;
  assertWindowSizePowerOfTwo(windowSize);

  const buffers = createBuffers(device, windowSize);
  const reversePipeline = createReversePipeline(device);
  const transformPipeline = createTransformPipeline(device);

  const reverse = (encoder: GPUCommandEncoder, waves: ComplexGpuBuffer) => {
    const { windowCount } = buffers.paramsValue;

    const bindGroup = createReverseBindGroup(
      device,
      reversePipeline,
      buffers,
      waves,
    );
    const pass = encoder.beginComputePass({
      label: 'fft4-reverse-pass',
      timestampWrites: timestampWrites?.reverse,
    });
    pass.setPipeline(reversePipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(windowCount);
    pass.end();
  };
  const transform = (encoder: GPUCommandEncoder, waves: ComplexGpuBuffer) => {
    const { windowCount } = buffers.paramsValue;

    const bindGroup = createTransformBindGroup(
      device,
      transformPipeline,
      buffers,
      waves,
    );
    const pass = encoder.beginComputePass({
      label: 'fft4-transform-pass',
      timestampWrites: timestampWrites?.transform,
    });
    pass.setPipeline(transformPipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(windowCount);
    pass.end();
  };

  const fourier: GpuFourier = {
    forward: (encoder, waves) => {
      reverse(encoder, waves);
      transform(encoder, waves);
    },
    writeParams: buffers.writeParams,
    destroy: () => {
      buffers.destroy();
    },
  };
  return fourier;
};
