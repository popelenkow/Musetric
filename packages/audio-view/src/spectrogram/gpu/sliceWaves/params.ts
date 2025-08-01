export type SliceWavesShaderParams = {
  windowSize: number;
  paddedWindowSize: number;
  windowCount: number;
  visibleSamples: number;
  step: number;
};

export type SliceWavesParams = {
  windowSize: number;
  windowCount: number;
  sampleRate: number;
  visibleTimeBefore: number;
  visibleTimeAfter: number;
  zeroPaddingFactor: number;
};

const toShaderParams = (params: SliceWavesParams): SliceWavesShaderParams => {
  const {
    windowSize,
    windowCount,
    sampleRate,
    visibleTimeBefore,
    visibleTimeAfter,
    zeroPaddingFactor,
  } = params;
  const paddedWindowSize = windowSize * zeroPaddingFactor;
  const beforeSamples = visibleTimeBefore * sampleRate + windowSize;
  const afterSamples = visibleTimeAfter * sampleRate;
  const visibleSamples = Math.ceil(beforeSamples + afterSamples);
  const step = (visibleSamples - windowSize) / (windowCount - 1);
  return {
    windowSize,
    paddedWindowSize,
    windowCount,
    visibleSamples,
    step,
  };
};

export type StateParams = {
  value: SliceWavesParams;
  shader: SliceWavesShaderParams;
  buffer: GPUBuffer;
  write: (value: SliceWavesParams) => void;
  destroy: () => void;
};

export const createParams = (device: GPUDevice): StateParams => {
  const array = new DataView(new ArrayBuffer(20));
  const buffer = device.createBuffer({
    label: 'slice-waves-params-buffer',
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
      array.setUint32(0, shader.windowSize, true);
      array.setUint32(4, shader.paddedWindowSize, true);
      array.setUint32(8, shader.windowCount, true);
      array.setUint32(12, shader.visibleSamples, true);
      array.setFloat32(16, shader.step, true);
      device.queue.writeBuffer(buffer, 0, array.buffer);
    },
    destroy: () => {
      buffer.destroy();
    },
  };
  return ref;
};
