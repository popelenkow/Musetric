import { ComplexArray } from '../complexArray';
import { Fourier } from '../fourier';
import shaderCode from './index.wgsl?raw';

const createReverseTable = (width: number): Uint32Array => {
  const reverseTable = new Uint32Array(1 << width);
  for (let j = 0; j < reverseTable.length; j++) {
    reverseTable[j] = 0;
    for (let shift = 0; shift < width + 1; shift += 2) {
      const revShift = width - shift - 1;
      reverseTable[j] |= ((j >>> shift) & 3) << revShift;
    }
    reverseTable[j] /= 2;
  }
  return reverseTable;
};

const createTrigTable = (windowSize: number): Float32Array => {
  const table = new Float32Array(2 * windowSize);
  for (let i = 0; i < table.length; i += 2) {
    const angle = (Math.PI * i) / windowSize;
    table[i] = Math.cos(angle);
    table[i + 1] = -Math.sin(angle);
  }
  return table;
};

const getWidth = (windowSize: number): number => {
  let power = 0;
  for (let t = 1; windowSize > t; t <<= 1) {
    power++;
  }
  const width = power % 2 === 0 ? power - 1 : power;
  return width - 1;
};

export const createFftRadix4Gpu = async (
  windowSize: number,
  device: GPUDevice,
): Promise<Fourier> => {
  if (windowSize <= 1 || (windowSize & (windowSize - 1)) !== 0) {
    throw new Error('FFT size must be a power of two and bigger than 1');
  }

  const module = device.createShaderModule({
    label: 'fft4-shader',
    code: shaderCode,
  });
  const pipeline = device.createComputePipeline({
    label: 'fft4-pipeline',
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });

  const trigTable = createTrigTable(windowSize);
  const width = getWidth(windowSize);
  const reverseTable = createReverseTable(width);

  const reverseTableBuffer = device.createBuffer({
    label: 'fft4-reverse-table',
    size: reverseTable.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(reverseTableBuffer, 0, reverseTable);

  const trigTableBuffer = device.createBuffer({
    label: 'fft4-trig-table',
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
      label: 'fft4-input-real',
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const inputImagBuffer = device.createBuffer({
      label: 'fft4-input-imag',
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const outputRealBuffer = device.createBuffer({
      label: 'fft4-output-real',
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });
    const outputImagBuffer = device.createBuffer({
      label: 'fft4-output-imag',
      size: totalSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const readRealBuffer = device.createBuffer({
      label: 'fft4-read-real',
      size: totalSize,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    const readImagBuffer = device.createBuffer({
      label: 'fft4-read-imag',
      size: totalSize,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const paramsBuffer = device.createBuffer({
      label: 'fft4-params',
      size: 4 * Uint32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(inputRealBuffer, 0, input.real);
    device.queue.writeBuffer(inputImagBuffer, 0, input.imag);
    device.queue.writeBuffer(
      paramsBuffer,
      0,
      new Uint32Array([windowSize, width, inverse ? 1 : 0, numWindows]),
    );

    const bindGroup = device.createBindGroup({
      label: 'fft4-bind-group',
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

    const encoder = device.createCommandEncoder({ label: 'fft4-encoder' });
    const pass = encoder.beginComputePass({ label: 'fft4-pass' });
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
