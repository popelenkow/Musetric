import {
  ComplexArray,
  ComplexGpuBuffer,
  createComplexArray,
} from '../../common';

export type CreatePipelineBuffersOptions = {
  windowSize: number;
  windowCount: number;
};

export type PipelineBuffers = {
  signal: ComplexGpuBuffer;
  signalArray: ComplexArray;
  resize: (windowSize: number, windowCount: number) => void;
  destroy: () => void;
};
export const createPipelineBuffers = (device: GPUDevice) => {
  const buffers: PipelineBuffers = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    signal: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    signalArray: undefined!,
    resize: (windowSize, windowCount) => {
      buffers.signal?.real.destroy();
      buffers.signal?.imag.destroy();
      buffers.signal = {
        real: device.createBuffer({
          label: 'pipeline-signal-real-buffer',
          size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
          usage:
            GPUBufferUsage.STORAGE |
            GPUBufferUsage.COPY_SRC |
            GPUBufferUsage.COPY_DST,
        }),
        imag: device.createBuffer({
          label: 'pipeline-signal-imag-buffer',
          size: windowSize * windowCount * Float32Array.BYTES_PER_ELEMENT,
          usage:
            GPUBufferUsage.STORAGE |
            GPUBufferUsage.COPY_SRC |
            GPUBufferUsage.COPY_DST,
        }),
      };
      buffers.signalArray = createComplexArray(windowSize * windowCount);
    },
    destroy: () => {
      buffers.signal.real.destroy();
      buffers.signal.imag.destroy();
    },
  };

  return buffers;
};
