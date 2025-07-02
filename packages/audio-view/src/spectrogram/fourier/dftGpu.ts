import type { ComplexArray } from '../../common';
import shaderCode from './dft.wgsl?raw';

export const createDftGpu = async (windowSize: number) => {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error('WebGPU adapter not available');
  }
  const device = await adapter.requestDevice();

  const module = device.createShaderModule({ code: shaderCode });
  const pipeline = device.createComputePipeline({
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });

  const inputBufferReal = device.createBuffer({
    size: windowSize * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  const inputBufferImag = device.createBuffer({
    size: windowSize * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const outputBufferReal = device.createBuffer({
    size: windowSize * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });
  const outputBufferImag = device.createBuffer({
    size: windowSize * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const readBufferReal = device.createBuffer({
    size: windowSize * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });
  const readBufferImag = device.createBuffer({
    size: windowSize * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  const paramsBuffer = device.createBuffer({
    size: Uint32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(paramsBuffer, 0, new Uint32Array([windowSize]));

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: inputBufferReal } },
      { binding: 1, resource: { buffer: inputBufferImag } },
      { binding: 2, resource: { buffer: outputBufferReal } },
      { binding: 3, resource: { buffer: outputBufferImag } },
      { binding: 4, resource: { buffer: paramsBuffer } },
    ],
  });

  return {
    forward: async (input: ComplexArray, output: ComplexArray) => {
      device.queue.writeBuffer(inputBufferReal, 0, input.real);
      device.queue.writeBuffer(inputBufferImag, 0, input.imag);

      const encoder = device.createCommandEncoder();
      const pass = encoder.beginComputePass();
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);

      const workgroupSize = 64;
      const numGroups = Math.ceil(windowSize / workgroupSize);
      pass.dispatchWorkgroups(numGroups);
      pass.end();

      encoder.copyBufferToBuffer(
        outputBufferReal,
        0,
        readBufferReal,
        0,
        windowSize * Float32Array.BYTES_PER_ELEMENT,
      );
      encoder.copyBufferToBuffer(
        outputBufferImag,
        0,
        readBufferImag,
        0,
        windowSize * Float32Array.BYTES_PER_ELEMENT,
      );

      device.queue.submit([encoder.finish()]);
      await device.queue.onSubmittedWorkDone();

      await readBufferReal.mapAsync(GPUMapMode.READ);
      output.real.set(new Float32Array(readBufferReal.getMappedRange()));
      readBufferReal.unmap();

      await readBufferImag.mapAsync(GPUMapMode.READ);
      output.imag.set(new Float32Array(readBufferImag.getMappedRange()));
      readBufferImag.unmap();
    },
  };
};
