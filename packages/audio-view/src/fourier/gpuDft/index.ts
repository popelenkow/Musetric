import { ComplexArray, ComplexGpuBuffer } from '../../common';
import { CreateGpuFourier, GpuFourier } from '../gpuFourier';
import { createIoBuffers } from './ioBuffers';
import { createParams } from './params';
import { createBindGroup, createPipeline } from './pipeline';
import { createStaticBuffers } from './staticBuffers';

export const createGpuDft: CreateGpuFourier = async (options) => {
  const { windowSize, device } = options;
  let windowCount = options.windowCount;

  const staticBuffers = createStaticBuffers(device);
  let ioBuffers = createIoBuffers(device, windowSize, windowCount);
  const params = createParams();

  const xWorkgroupSize = 64;
  const xWorkgroupCount = Math.ceil(windowSize / xWorkgroupSize);

  const pipeline = createPipeline(device);

  const createGroup = () =>
    createBindGroup(device, pipeline, {
      ...staticBuffers,
      ...ioBuffers,
    });

  let bindGroup = createGroup();

  const transform = async (
    input: ComplexArray,
    inverse: boolean,
  ): Promise<ComplexGpuBuffer> => {
    device.queue.writeBuffer(ioBuffers.inputReal, 0, input.real);
    device.queue.writeBuffer(ioBuffers.inputImag, 0, input.imag);
    params.set({ windowSize, windowCount, inverse });
    device.queue.writeBuffer(staticBuffers.params, 0, params.instance);

    const encoder = device.createCommandEncoder({ label: 'dft-encoder' });
    const pass = encoder.beginComputePass({ label: 'dft-pass' });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(xWorkgroupCount, windowCount);
    pass.end();

    device.queue.submit([encoder.finish()]);
    await device.queue.onSubmittedWorkDone();

    return { real: ioBuffers.outputReal, imag: ioBuffers.outputImag };
  };

  const fourier: GpuFourier = {
    forward: (input) => transform(input, false),
    inverse: (input) => transform(input, true),
    resize: (newWindowCount) => {
      windowCount = newWindowCount;
      ioBuffers.destroy();
      ioBuffers = createIoBuffers(device, windowSize, windowCount);
      bindGroup = createGroup();
    },
    destroy: () => {
      ioBuffers.destroy();
      staticBuffers.destroy();
    },
  };
  return fourier;
};
