import { ComplexArray, ComplexGpuBuffer } from '../../common';
import { CreateGpuFourier, GpuFourier } from '../gpuFourier';
import { assertWindowSizePowerOfTwo } from '../isPowerOfTwo';
import { createIoBuffers } from './ioBuffers';
import { createParams } from './params';
import { createBindGroup, createPipeline } from './pipeline';
import { createStaticBuffers } from './staticBuffers';

export const createGpuFftRadix4: CreateGpuFourier = async (options) => {
  const { windowSize, device } = options;
  let windowCount = options.windowCount;
  assertWindowSizePowerOfTwo(windowSize);

  const staticBuffers = createStaticBuffers(device, windowSize);
  let ioBuffers = createIoBuffers(device, windowSize, windowCount);
  const { reverseWidth } = staticBuffers;
  const params = createParams();
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

    params.set({ windowSize, windowCount, reverseWidth, inverse });
    device.queue.writeBuffer(staticBuffers.params, 0, params.instance);

    const encoder = device.createCommandEncoder({ label: 'fft4-encoder' });
    const pass = encoder.beginComputePass({ label: 'fft4-pass' });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(windowCount);
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
