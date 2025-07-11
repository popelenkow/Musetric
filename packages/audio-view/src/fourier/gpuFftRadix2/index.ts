import { ComplexArray, ComplexGpuBuffer } from '../../common';
import { CreateGpuFourier, GpuFourier } from '../gpuFourier';
import { assertWindowSizePowerOfTwo } from '../isPowerOfTwo';
import { createBuffers } from './buffers';
import { createBindGroup, createPipeline } from './pipeline';

export const createGpuFftRadix2: CreateGpuFourier = async (options) => {
  const { windowSize, device } = options;
  let windowCount = options.windowCount;
  assertWindowSizePowerOfTwo(windowSize);

  const buffers = createBuffers(device, windowSize, windowCount);
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
    buffers.writeParams({ windowSize, windowCount, inverse });

    const pass = encoder.beginComputePass({ label: 'fft2-pass' });
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
