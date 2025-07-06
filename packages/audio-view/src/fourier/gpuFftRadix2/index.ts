import { ComplexArray } from '../complexArray';
import { CreateGpuFourier } from '../fourier';
import { assertWindowSizePowerOfTwo } from '../isPowerOfTwo';
import {
  createStaticBuffers,
  createIoBuffers,
  createBindGroup,
  createParams,
} from './common';
import shaderCode from './index.wgsl?raw';

export const createGpuFftRadix2: CreateGpuFourier = async (options) => {
  const { windowSize, device } = options;
  let windowCount = options.windowCount;
  assertWindowSizePowerOfTwo(windowSize);

  const staticBuffers = createStaticBuffers(device, windowSize);
  let ioBuffers = createIoBuffers(device, windowSize, windowCount);
  const params = createParams();

  const module = device.createShaderModule({
    label: 'fft2-shader',
    code: shaderCode,
  });
  const pipeline = device.createComputePipeline({
    label: 'fft2-pipeline',
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });

  const createGroup = () =>
    createBindGroup(device, pipeline, {
      ...staticBuffers,
      ...ioBuffers,
    });

  let bindGroup = createGroup();

  const transform = async (
    input: ComplexArray,
    output: ComplexArray,
    inverse: boolean,
  ) => {
    const totalSize = windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT;

    device.queue.writeBuffer(ioBuffers.inputReal, 0, input.real);
    device.queue.writeBuffer(ioBuffers.inputImag, 0, input.imag);

    params.set({ windowSize, windowCount, inverse });
    device.queue.writeBuffer(staticBuffers.params, 0, params.instance);

    const encoder = device.createCommandEncoder({ label: 'fft2-encoder' });
    const pass = encoder.beginComputePass({ label: 'fft2-pass' });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(windowCount);
    pass.end();

    encoder.copyBufferToBuffer(
      ioBuffers.outputReal,
      0,
      ioBuffers.readReal,
      0,
      totalSize,
    );
    encoder.copyBufferToBuffer(
      ioBuffers.outputImag,
      0,
      ioBuffers.readImag,
      0,
      totalSize,
    );

    device.queue.submit([encoder.finish()]);
    await device.queue.onSubmittedWorkDone();

    await Promise.all([
      ioBuffers.readReal.mapAsync(GPUMapMode.READ),
      ioBuffers.readImag.mapAsync(GPUMapMode.READ),
    ]);

    output.real.set(new Float32Array(ioBuffers.readReal.getMappedRange()));
    output.imag.set(new Float32Array(ioBuffers.readImag.getMappedRange()));

    ioBuffers.readReal.unmap();
    ioBuffers.readImag.unmap();
  };

  return {
    forward: async (input: ComplexArray, output: ComplexArray) => {
      await transform(input, output, false);
    },
    inverse: async (input: ComplexArray, output: ComplexArray) => {
      await transform(input, output, true);
    },
    resize: (newWindowCount: number) => {
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
};
