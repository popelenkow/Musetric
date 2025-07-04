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
  device: GPUDevice,
): Promise<Fourier> => {
  if (windowSize <= 1 || (windowSize & (windowSize - 1)) !== 0) {
    throw new Error('FFT size must be a power of two and bigger than 1');
  }

  const module = device.createShaderModule({
    label: 'fft2-shader',
    code: shaderCode,
  });
  const pipeline = device.createComputePipeline({
    label: 'fft2-pipeline',
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });

  const reverseTable = createReverseTable(windowSize);
  const trigTable = createTrigTable(windowSize);

  const reverseTableBuffer = device.createBuffer({
    label: 'fft2-reverse-table',
    size: reverseTable.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(reverseTableBuffer, 0, reverseTable);

  const trigTableBuffer = device.createBuffer({
    label: 'fft2-trig-table',
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

    const inputRealBuffer = device.createBuffer({
      label: 'fft2-input-real',
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const inputImagBuffer = device.createBuffer({
      label: 'fft2-input-imag',
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const outputRealBuffer = device.createBuffer({
      label: 'fft2-output-real',
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });
    const outputImagBuffer = device.createBuffer({
      label: 'fft2-output-imag',
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const readRealBuffer = device.createBuffer({
      label: 'fft2-read-real',
      size: totalSize,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    const readImagBuffer = device.createBuffer({
      label: 'fft2-read-imag',
      size: totalSize,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const paramsBuffer = device.createBuffer({
      label: 'fft2-params',
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
      label: 'fft2-bind-group',
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: inputRealBuffer } },
        { binding: 1, resource: { buffer: inputImagBuffer } },
        { binding: 2, resource: { buffer: outputRealBuffer } },
        { binding: 3, resource: { buffer: outputImagBuffer } },
        { binding: 4, resource: { buffer: reverseTableBuffer } },
        { binding: 5, resource: { buffer: trigTableBuffer } },
        { binding: 6, resource: { buffer: paramsBuffer } },
      ],
    });

    const encoder = device.createCommandEncoder({ label: 'fft2-encoder' });
    const pass = encoder.beginComputePass({ label: 'fft2-pass' });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(numWindows);
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
