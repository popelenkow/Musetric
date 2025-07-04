import { ComplexArray } from '../complexArray';
import { Fourier } from '../fourier';
import shaderCode from './index.wgsl?raw';

export const createDftGpu = async (
  windowSize: number,
  device: GPUDevice,
): Promise<Fourier> => {
  const module = device.createShaderModule({
    label: 'dft-shader',
    code: shaderCode,
  });
  const pipeline = device.createComputePipeline({
    label: 'dft-pipeline',
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });

  const transform = async (
    input: ComplexArray,
    output: ComplexArray,
    inverse: boolean,
  ) => {
    const numWindows = input.real.length / windowSize;
    const totalSize = input.real.length * Float32Array.BYTES_PER_ELEMENT;

    const inputRealBuffer = device.createBuffer({
      label: 'dft-input-real',
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const inputImagBuffer = device.createBuffer({
      label: 'dft-input-imag',
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const outputRealBuffer = device.createBuffer({
      label: 'dft-output-real',
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });
    const outputImagBuffer = device.createBuffer({
      label: 'dft-output-imag',
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const readRealBuffer = device.createBuffer({
      label: 'dft-read-real',
      size: totalSize,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    const readImagBuffer = device.createBuffer({
      label: 'dft-read-imag',
      size: totalSize,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const paramsBuffer = device.createBuffer({
      label: 'dft-params',
      size: 3 * Uint32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(inputRealBuffer, 0, input.real);
    device.queue.writeBuffer(inputImagBuffer, 0, input.imag);
    device.queue.writeBuffer(
      paramsBuffer,
      0,
      new Uint32Array([windowSize, inverse ? 1 : 0, numWindows]),
    );

    const bindGroup = device.createBindGroup({
      label: 'dft-bind-group',
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: inputRealBuffer } },
        { binding: 1, resource: { buffer: inputImagBuffer } },
        { binding: 2, resource: { buffer: outputRealBuffer } },
        { binding: 3, resource: { buffer: outputImagBuffer } },
        { binding: 4, resource: { buffer: paramsBuffer } },
      ],
    });

    const encoder = device.createCommandEncoder({ label: 'dft-encoder' });
    const pass = encoder.beginComputePass({ label: 'dft-pass' });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);

    const workgroupSize = 64;
    const numXGroups = Math.ceil(windowSize / workgroupSize);
    pass.dispatchWorkgroups(numXGroups, numWindows);
    pass.end();

    encoder.copyBufferToBuffer(
      outputRealBuffer,
      0,
      readRealBuffer,
      0,
      totalSize,
    );
    encoder.copyBufferToBuffer(
      outputImagBuffer,
      0,
      readImagBuffer,
      0,
      totalSize,
    );

    device.queue.submit([encoder.finish()]);
    await device.queue.onSubmittedWorkDone();

    await readRealBuffer.mapAsync(GPUMapMode.READ);
    output.real.set(new Float32Array(readRealBuffer.getMappedRange()));
    readRealBuffer.unmap();

    await readImagBuffer.mapAsync(GPUMapMode.READ);
    output.imag.set(new Float32Array(readImagBuffer.getMappedRange()));
    readImagBuffer.unmap();
  };

  return {
    forward: async (input: ComplexArray, output: ComplexArray) => {
      await transform(input, output, false);
    },
    inverse: async (input: ComplexArray, output: ComplexArray) => {
      await transform(input, output, true);
    },
  };
};
