import { createParams, FilterWaveParams, StateParams } from './params';
import { createPipeline } from './pipeline';
import { createWindowFilter } from './windowFilter';

export type State = {
  pipeline: GPUComputePipeline;
  params: StateParams;
  bindGroup: GPUBindGroup;
  configure: (signal: GPUBuffer, value: FilterWaveParams) => void;
  destroy: () => void;
};
export const createState = (device: GPUDevice): State => {
  const pipeline = createPipeline(device);
  const params = createParams(device);
  const windowFilter = createWindowFilter(device);

  const state: State = {
    pipeline,
    params,
    bindGroup: undefined!,
    configure: (signal, value) => {
      params.write(value);
      windowFilter.resize(value.windowSize);
      state.bindGroup = device.createBindGroup({
        label: 'filter-wave-bind-group',
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: signal } },
          { binding: 1, resource: { buffer: params.buffer } },
          { binding: 2, resource: { buffer: windowFilter.buffer } },
        ],
      });
    },
    destroy: () => {
      params.destroy();
      windowFilter.destroy();
    },
  };

  return state;
};
