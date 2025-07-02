import { ComplexArray } from '../complexArray';
import { Fourier } from '../fourier';
import shaderCode from './index.wgsl?raw';

const createReverseTable = (windowSize: number): Uint32Array => {
  const bits = Math.log2(windowSize);
  const table = new Uint32Array(windowSize);
  for (let i = 0; i < windowSize; i++) {
    let rev = 0;
    for (let b = 0; b < bits; b++) {
      rev = (rev << 1) | ((i >> b) & 1);
    }
    table[i] = rev;
  }
  return table;
};

const createTrigTable = (windowSize: number): Float32Array => {
  const half = windowSize >> 1;
  const table = new Float32Array(2 * half);
  for (let i = 0; i < half; i++) {
    const angle = (2 * Math.PI * i) / windowSize;
    table[2 * i] = Math.cos(angle);
    table[2 * i + 1] = Math.sin(angle);
  }
  return table;
};

export const createFftRadix2Gpu = async (
  windowSize: number,
): Promise<Fourier> => {
  if (windowSize <= 1 || (windowSize & (windowSize - 1)) !== 0) {
    throw new Error('FFT size must be a power of two and bigger than 1');
  }

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

  const reverseTable = createReverseTable(windowSize);
  const trigTable = createTrigTable(windowSize);

  const reverseTableBuffer = device.createBuffer({
    size: reverseTable.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(reverseTableBuffer, 0, reverseTable);

  const trigTableBuffer = device.createBuffer({
    size: trigTable.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(trigTableBuffer, 0, trigTable);

  const transform = async (
    input: ComplexArray,
    output: ComplexArray,
    inverse: boolean,
  ) => {
    const numWindows = input.real.length / windowSize;
    const totalSize = input.real.length * Float32Array.BYTES_PER_ELEMENT;

    const inputBufferReal = device.createBuffer({
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const inputBufferImag = device.createBuffer({
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const outputBufferReal = device.createBuffer({
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });
    const outputBufferImag = device.createBuffer({
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const readBufferReal = device.createBuffer({
      size: totalSize,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    const readBufferImag = device.createBuffer({
      size: totalSize,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const paramsBuffer = device.createBuffer({
      size: 3 * Uint32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(inputBufferReal, 0, input.real);
    device.queue.writeBuffer(inputBufferImag, 0, input.imag);
    device.queue.writeBuffer(
      paramsBuffer,
      0,
      new Uint32Array([windowSize, inverse ? 1 : 0, numWindows]),
    );

    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: inputBufferReal } },
        { binding: 1, resource: { buffer: inputBufferImag } },
        { binding: 2, resource: { buffer: outputBufferReal } },
        { binding: 3, resource: { buffer: outputBufferImag } },
        { binding: 4, resource: { buffer: reverseTableBuffer } },
        { binding: 5, resource: { buffer: trigTableBuffer } },
        { binding: 6, resource: { buffer: paramsBuffer } },
      ],
    });

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(numWindows);
    pass.end();

    encoder.copyBufferToBuffer(
      outputBufferReal,
      0,
      readBufferReal,
      0,
      totalSize,
    );
    encoder.copyBufferToBuffer(
      outputBufferImag,
      0,
      readBufferImag,
      0,
      totalSize,
    );

    device.queue.submit([encoder.finish()]);
    await device.queue.onSubmittedWorkDone();

    await readBufferReal.mapAsync(GPUMapMode.READ);
    output.real.set(new Float32Array(readBufferReal.getMappedRange()));
    readBufferReal.unmap();

    await readBufferImag.mapAsync(GPUMapMode.READ);
    output.imag.set(new Float32Array(readBufferImag.getMappedRange()));
    readBufferImag.unmap();
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
