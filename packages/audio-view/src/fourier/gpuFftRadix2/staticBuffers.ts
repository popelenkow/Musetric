import { utilsRadix2 } from '../utilsRadix2';
import { paramsCount } from './params';

export const createStaticBuffers = (device: GPUDevice, windowSize: number) => {
  const reverseTable = utilsRadix2.createReverseTable(windowSize);
  const trigTable = utilsRadix2.createTrigTable(windowSize);

  const params = device.createBuffer({
    label: 'fft2-params',
    size: paramsCount * Uint32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const reverseTableBuf = device.createBuffer({
    label: 'fft2-reverse-table',
    size: reverseTable.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(reverseTableBuf, 0, reverseTable);

  const trigTableBuf = device.createBuffer({
    label: 'fft2-trig-table',
    size: trigTable.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(trigTableBuf, 0, trigTable);

  return {
    params,
    reverseTable: reverseTableBuf,
    trigTable: trigTableBuf,
    destroy: () => {
      params.destroy();
      reverseTableBuf.destroy();
      trigTableBuf.destroy();
    },
  };
};
export type StaticBuffers = ReturnType<typeof createStaticBuffers>;
