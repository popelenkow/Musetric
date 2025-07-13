/* eslint-disable @typescript-eslint/consistent-type-assertions */

export type GpuTimer<Label extends string> = {
  timestampWrites: Record<Label, GPUComputePassTimestampWrites>;
  resolve: (encoder: GPUCommandEncoder) => void;
  read: () => Promise<Record<Label, number>>;
  destroy: () => void;
};

export const createGpuTimer = <Labels extends readonly string[]>(
  device: GPUDevice,
  labels: [...Labels],
): GpuTimer<Labels[number]> => {
  const count = labels.length * 2;
  const size = count * BigUint64Array.BYTES_PER_ELEMENT;

  const querySet = device.createQuerySet({ type: 'timestamp', count });
  const resolveBuffer = device.createBuffer({
    label: 'timer-resolve-buffer',
    size,
    usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
  });
  const readBuffer = device.createBuffer({
    label: 'timer-read-buffer',
    size,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  const timestampWrites = labels.reduce(
    (acc, label, i) => {
      const base = i * 2;
      acc[label] = {
        querySet,
        beginningOfPassWriteIndex: base,
        endOfPassWriteIndex: base + 1,
      };
      return acc;
    },
    {} as Record<Labels[number], GPUComputePassTimestampWrites>,
  );

  return {
    timestampWrites,
    resolve: (encoder) => {
      encoder.resolveQuerySet(querySet, 0, count, resolveBuffer, 0);
      encoder.copyBufferToBuffer(resolveBuffer, 0, readBuffer, 0, size);
    },
    read: async () => {
      await readBuffer.mapAsync(GPUMapMode.READ);
      const data = new BigUint64Array(readBuffer.getMappedRange());
      const result = labels.reduce(
        (acc, label, i) => {
          const start = data[i * 2];
          const end = data[i * 2 + 1];
          acc[label] = Number(end - start) / 1e6;
          return acc;
        },
        {} as Record<Labels[number], number>,
      );
      readBuffer.unmap();
      return result;
    },
    destroy: () => {
      querySet.destroy();
      resolveBuffer.destroy();
      readBuffer.destroy();
    },
  };
};
