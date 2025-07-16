import { ComplexGpuBuffer } from '../../common';
import { CreateGpuFourier, GpuFourier } from '../gpuFourier';
import { assertWindowSizePowerOfTwo } from '../isPowerOfTwo';
import { createReverseBindGroup, createTransformBindGroup } from './bindGroup';
import { createBuffers } from './buffers';
import { createReversePipeline, createTransformPipeline } from './pipeline';

export const createGpuFftRadix4: CreateGpuFourier = async (options) => {
  const { windowSize, device, timestampWrites } = options;
  let windowCount = options.windowCount;
  assertWindowSizePowerOfTwo(windowSize);

  const buffers = createBuffers(device, windowSize, windowCount);
  const reversePipeline = createReversePipeline(device);
  const transformPipeline = createTransformPipeline(device);

  const reverse = (encoder: GPUCommandEncoder) => {
    const bindGroup = createReverseBindGroup(device, reversePipeline, buffers);
    const pass = encoder.beginComputePass({
      label: 'fft4-reverse-pass',
      timestampWrites: timestampWrites?.reverse,
    });
    pass.setPipeline(reversePipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(windowCount);
    pass.end();
  };
  const transform = (encoder: GPUCommandEncoder): ComplexGpuBuffer => {
    const bindGroup = createTransformBindGroup(
      device,
      transformPipeline,
      buffers,
    );
    const pass = encoder.beginComputePass({
      label: 'fft4-transform-pass',
      timestampWrites: timestampWrites?.transform,
    });
    pass.setPipeline(transformPipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(windowCount);
    pass.end();

    return { real: buffers.dataReal, imag: buffers.dataImag };
  };

  const fourier: GpuFourier = {
    forward: (encoder, input) => {
      device.queue.writeBuffer(buffers.dataReal, 0, input.real);
      device.queue.writeBuffer(buffers.dataImag, 0, input.imag);
      reverse(encoder);
      return transform(encoder);
    },
    resize: (newWindowCount) => {
      windowCount = newWindowCount;
      buffers.resize(windowCount);
    },
    destroy: () => {
      buffers.destroy();
    },
  };
  return fourier;
};
