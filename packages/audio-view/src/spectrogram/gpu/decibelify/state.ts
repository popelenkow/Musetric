import { createParams, DecibelifyParams, StateParams } from './params';
import { createPipeline } from './pipeline';

export type State = {
  pipeline: GPUComputePipeline;
  bindGroup: GPUBindGroup;
  params: StateParams;
  configure: (signal: GPUBuffer, value: DecibelifyParams) => void;
  destroy: () => void;
};

export const createState = (device: GPUDevice) => {
  const pipeline = createPipeline(device);
  const params = createParams(device);

  const state: State = {
    pipeline,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bindGroup: undefined!,
    params,
    configure: (signal, value) => {
      params.write(value);
      state.bindGroup = device.createBindGroup({
        label: 'decibelify-bind-group',
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: signal } },
          { binding: 1, resource: { buffer: params.buffer } },
        ],
      });
    },
    destroy: () => {
      params.destroy();
    },
  };

  return state;
};
