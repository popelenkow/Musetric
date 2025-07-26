import { ComplexGpuBuffer } from '../../../common';
import { createParams, StateParams } from './params';
import { createPipeline } from './pipeline';

export type State = {
  pipeline: GPUComputePipeline;
  params: StateParams;
  bindGroup: GPUBindGroup;
  configure: (
    signal: ComplexGpuBuffer,
    windowSize: number,
    windowCount: number,
  ) => void;
  destroy: () => void;
};

export const createState = (device: GPUDevice) => {
  const pipeline = createPipeline(device);
  const params = createParams(device);

  const ref: State = {
    pipeline,
    params,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bindGroup: undefined!,
    configure: (signal, windowSize, windowCount) => {
      ref.params.write({ windowSize, windowCount });
      ref.bindGroup = device.createBindGroup({
        label: 'magnitudify-bind-group',
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: signal.real } },
          { binding: 1, resource: { buffer: signal.imag } },
          { binding: 2, resource: { buffer: params.buffer } },
        ],
      });
    },
    destroy: () => {
      params.destroy();
    },
  };
  return ref;
};
