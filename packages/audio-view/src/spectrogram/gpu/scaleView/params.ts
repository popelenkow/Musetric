import { ViewSize } from '../../../common';
import { SignalViewParams } from '../../signalViewParams';

export type ScaleViewShaderParams = {
  halfSize: number;
  width: number;
  height: number;
  minBin: number;
  maxBin: number;
  logMin: number;
  logRange: number;
};

export type ScaleViewParams = SignalViewParams &
  ViewSize & {
    windowSize: number;
  };

const toShaderParams = (params: ScaleViewParams): ScaleViewShaderParams => {
  const { windowSize, sampleRate, minFrequency, maxFrequency, width, height } =
    params;
  const halfSize = windowSize / 2;
  const maxBin = Math.min(
    Math.floor((maxFrequency / sampleRate) * windowSize),
    halfSize,
  );
  const minBin = Math.max(
    Math.floor((minFrequency / sampleRate) * windowSize),
    0,
  );
  const logMin = Math.log(minBin + 1);
  const logRange = Math.log(maxBin + 1) - logMin;
  return {
    halfSize,
    width,
    height,
    minBin,
    maxBin,
    logMin,
    logRange,
  };
};

export type StateParams = {
  value: ScaleViewParams;
  buffer: GPUBuffer;
  write: (value: ScaleViewParams) => void;
  destroy: () => void;
};

export const createParams = (device: GPUDevice) => {
  const array = new DataView(new ArrayBuffer(28));

  const buffer = device.createBuffer({
    label: 'scale-view-params-buffer',
    size: array.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const state: StateParams = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    value: undefined!,
    buffer,
    write: (value) => {
      state.value = value;
      const shader = toShaderParams(value);

      array.setUint32(0, shader.halfSize, true);
      array.setUint32(4, shader.width, true);
      array.setUint32(8, shader.height, true);
      array.setUint32(12, shader.minBin, true);
      array.setUint32(16, shader.maxBin, true);
      array.setFloat32(20, shader.logMin, true);
      array.setFloat32(24, shader.logRange, true);

      device.queue.writeBuffer(buffer, 0, array.buffer);
    },
    destroy: () => {
      buffer.destroy();
    },
  };
  return state;
};
