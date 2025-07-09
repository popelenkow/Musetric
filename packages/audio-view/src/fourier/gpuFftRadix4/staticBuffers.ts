import { utilsRadix4 } from '../utilsRadix4';
import { paramsCount } from './params';

export const createStaticBuffers = (device: GPUDevice, windowSize: number) => {
  const reverseWidth = utilsRadix4.getReverseWidth(windowSize);
  const reverseTable = utilsRadix4.createReverseTable(reverseWidth);
  const trigTable = utilsRadix4.createTrigTable(windowSize);

  const params = device.createBuffer({
    label: 'fft4-params',
    size: paramsCount * Uint32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const reverseTableBuf = device.createBuffer({
    label: 'fft4-reverse-table',
    size: reverseTable.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(reverseTableBuf, 0, reverseTable);

  const trigTableBuf = device.createBuffer({
    label: 'fft4-trig-table',
    size: trigTable.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(trigTableBuf, 0, trigTable);

  return {
    params,
    reverseTable: reverseTableBuf,
    trigTable: trigTableBuf,
    reverseWidth,
    destroy: () => {
      params.destroy();
      reverseTableBuf.destroy();
      trigTableBuf.destroy();
    },
  };
};
export type StaticBuffers = ReturnType<typeof createStaticBuffers>;
