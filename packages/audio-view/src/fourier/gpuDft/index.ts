import { ComplexArray, ComplexGpuBuffer } from '../../common';
import { CreateGpuFourier, GpuFourier } from '../gpuFourier';
import { createBindGroup } from './bindGroup';
import { createBuffers } from './buffers';
import { createPipeline } from './pipeline';

export const createGpuDft: CreateGpuFourier = async (options) => {
  const { windowSize, device } = options;
  let windowCount = options.windowCount;

  const buffers = createBuffers(device, windowSize, windowCount);
  const xWorkgroupSize = 64;
  const xWorkgroupCount = Math.ceil(windowSize / xWorkgroupSize);
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

    const pass = encoder.beginComputePass({ label: 'dft-pass' });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(xWorkgroupCount, windowCount);
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
