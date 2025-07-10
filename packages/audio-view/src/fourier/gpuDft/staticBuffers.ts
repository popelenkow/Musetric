import { paramsCount } from './params';

export const createStaticBuffers = (device: GPUDevice) => {
  const params = device.createBuffer({
    label: 'dft-params',
    size: paramsCount * Uint32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  return {
    params,
    destroy: () => {
      params.destroy();
    },
  };
};
export type StaticBuffers = ReturnType<typeof createStaticBuffers>;
