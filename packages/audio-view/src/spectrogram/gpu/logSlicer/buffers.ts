import { Parameters } from '../../parameters';
import { ViewSize } from '.';

export type Params = {
  halfSize: number;
  width: number;
  height: number;
  minBin: number;
  maxBin: number;
  logMin: number;
  logRange: number;
};

export const createBuffers = (device: GPUDevice, windowSize: number) => {
  const halfSize = windowSize / 2;

  const paramsArray = new DataView(new ArrayBuffer(28));

  const params = device.createBuffer({
    label: 'drawer-compute-params',
    size: paramsArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const buffers = {
    params,
    writeParams: (data: Parameters, viewSize: ViewSize) => {
      const { width, height } = viewSize;
      const maxBin = Math.min(
        Math.floor((data.maxFrequency / data.sampleRate) * windowSize),
        halfSize,
      );
      const minBin = Math.max(
        Math.floor((data.minFrequency / data.sampleRate) * windowSize),
        0,
      );
      const logMin = Math.log(minBin + 1);
      const logRange = Math.log(maxBin + 1) - logMin;

      paramsArray.setUint32(0, halfSize, true);
      paramsArray.setUint32(4, width, true);
      paramsArray.setUint32(8, height, true);
      paramsArray.setUint32(12, minBin, true);
      paramsArray.setUint32(16, maxBin, true);
      paramsArray.setFloat32(20, logMin, true);
      paramsArray.setFloat32(24, logRange, true);
      device.queue.writeBuffer(params, 0, paramsArray.buffer);
    },
    destroy: () => {
      params.destroy();
    },
  };
  return buffers;
};
export type Buffers = ReturnType<typeof createBuffers>;
