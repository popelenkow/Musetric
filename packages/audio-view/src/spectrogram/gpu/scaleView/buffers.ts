import { ViewSize } from '../../../common';
import { SignalViewParams } from '../../signalViewParams';

export type ScaleViewParams = SignalViewParams &
  ViewSize & {
    windowSize: number;
  };

export type ScaleViewParamsShader = {
  halfSize: number;
  width: number;
  height: number;
  minBin: number;
  maxBin: number;
  logMin: number;
  logRange: number;
};

const toParamsShader = (params: ScaleViewParams): ScaleViewParamsShader => {
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

const defaultParams: ScaleViewParams = {
  sampleRate: 0,
  minFrequency: 0,
  maxFrequency: 0,
  windowSize: 0,
  width: 0,
  height: 0,
};
const defaultParamsShader = toParamsShader(defaultParams);

export type Buffers = {
  paramsValue: ScaleViewParams;
  paramsShader: ScaleViewParamsShader;
  params: GPUBuffer;
  writeParams: (params: ScaleViewParams) => void;
  destroy: () => void;
};

export const createBuffers = (device: GPUDevice) => {
  const paramsArray = new DataView(new ArrayBuffer(28));

  const params = device.createBuffer({
    label: 'scale-view-params-buffer',
    size: paramsArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const buffers: Buffers = {
    paramsValue: defaultParams,
    paramsShader: defaultParamsShader,
    params,
    writeParams: (value) => {
      buffers.paramsValue = value;
      buffers.paramsShader = toParamsShader(value);
      const shader = buffers.paramsShader;

      paramsArray.setUint32(0, shader.halfSize, true);
      paramsArray.setUint32(4, shader.width, true);
      paramsArray.setUint32(8, shader.height, true);
      paramsArray.setUint32(12, shader.minBin, true);
      paramsArray.setUint32(16, shader.maxBin, true);
      paramsArray.setFloat32(20, shader.logMin, true);
      paramsArray.setFloat32(24, shader.logRange, true);

      device.queue.writeBuffer(params, 0, paramsArray.buffer);
    },
    destroy: () => {
      params.destroy();
    },
  };
  return buffers;
};
