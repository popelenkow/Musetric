import { GpuFourierParams } from '../gpuFourier';
import { utilsRadix4 } from '../utilsRadix4';

export type GpuFftRadix4ShaderParams = {
  windowSize: number;
  windowCount: number;
  reverseWidth: number;
};

const toShaderParams = (
  params: GpuFourierParams,
): GpuFftRadix4ShaderParams => ({
  windowSize: params.windowSize,
  windowCount: params.windowCount,
  reverseWidth: utilsRadix4.getReverseWidth(params.windowSize),
});

export type StateParams = {
  value: GpuFourierParams;
  shader: GpuFftRadix4ShaderParams;
  buffer: GPUBuffer;
  write: (value: GpuFourierParams) => void;
  destroy: () => void;
};
export const createParams = (device: GPUDevice) => {
  const array = new Uint32Array(3);
  const buffer = device.createBuffer({
    label: 'fft4-params',
    size: array.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const ref: StateParams = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    value: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    shader: undefined!,
    buffer,
    write: (value) => {
      ref.value = value;
      const shader = toShaderParams(value);
      ref.shader = shader;
      array[0] = shader.windowSize;
      array[1] = shader.windowCount;
      array[2] = shader.reverseWidth;
      device.queue.writeBuffer(buffer, 0, array);
    },
    destroy: () => {
      buffer.destroy();
    },
  };
  return ref;
};
