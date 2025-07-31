import { CpuMarker } from '../../../common';

export type StateWave = {
  buffer: GPUBuffer;
  array: Float32Array;
  resize: (visibleSamples: number) => void;
  write: (
    wave: Float32Array,
    progress: number,
    windowSize: number,
    sampleRate: number,
    visibleTimeBefore: number,
  ) => void;
  destroy: () => void;
};

export const createStateWave = (
  device: GPUDevice,
  marker?: CpuMarker,
): StateWave => {
  const ref: StateWave = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    buffer: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    array: undefined!,
    resize: (visibleSamples) => {
      ref.array = new Float32Array(visibleSamples);
      ref.buffer?.destroy();
      ref.buffer = device.createBuffer({
        label: 'pipeline-wave-buffer',
        size: ref.array.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });
    },
    write: (wave, progress, windowSize, sampleRate, visibleTimeBefore) => {
      const visibleSamples = ref.array.length;
      const beforeSamples = visibleTimeBefore * sampleRate + windowSize;
      const startIndex = Math.floor(progress * wave.length - beforeSamples);

      const from = Math.max(0, -startIndex);
      const to = Math.min(visibleSamples, wave.length - startIndex);

      if (from > 0) {
        ref.array.fill(0, 0, from);
      }
      if (to > from) {
        const slice = wave.subarray(startIndex + from, startIndex + to);
        ref.array.set(slice, from);
      }
      if (to < ref.array.length) {
        ref.array.fill(0, to, ref.array.length);
      }
      device.queue.writeBuffer(ref.buffer, 0, ref.array);
    },
    destroy: () => {
      ref.buffer?.destroy();
    },
  };
  ref.write = marker?.(ref.write) ?? ref.write;
  return ref;
};
