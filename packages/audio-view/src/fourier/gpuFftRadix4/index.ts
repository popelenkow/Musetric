import { ComplexArray, ComplexGpuBuffer } from '../../common';
import { CreateGpuFourier, GpuFourier } from '../gpuFourier';
import { assertWindowSizePowerOfTwo } from '../isPowerOfTwo';
import { createBindGroup } from './bindGroup';
import { createBuffers } from './buffers';
import { createPipeline } from './pipeline';

export const createGpuFftRadix4: CreateGpuFourier = async (options) => {
  const { windowSize, device, timestampWrites } = options;
  let windowCount = options.windowCount;
  assertWindowSizePowerOfTwo(windowSize);

  const buffers = createBuffers(device, windowSize, windowCount);
  const { reverseWidth } = buffers;
  const pipeline = createPipeline(device);
  const createGroup = () => createBindGroup(device, pipeline, buffers);
  let bindGroup = createGroup();

  const transform = (
    encoder: GPUCommandEncoder,
    input: ComplexArray,
    inverse: boolean,
  ): ComplexGpuBuffer => {
    device.queue.writeBuffer(buffers.inputReal, 0, input.real);
    device.queue.writeBuffer(buffers.inputImag, 0, input.imag);
    buffers.writeParams({ windowSize, windowCount, reverseWidth, inverse });

    const pass = encoder.beginComputePass({
      label: 'fft4-pass',
      timestampWrites,
    });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(windowCount);
    pass.end();

    return { real: buffers.outputReal, imag: buffers.outputImag };
  };

  const fourier: GpuFourier = {
    forward: (encoder, input) => transform(encoder, input, false),
    inverse: (encoder, input) => transform(encoder, input, true),
    resize: (newWindowCount) => {
      windowCount = newWindowCount;
      buffers.resize(windowCount);
      bindGroup = createGroup();
    },
    destroy: () => {
      buffers.destroy();
    },
  };
  return fourier;
};
