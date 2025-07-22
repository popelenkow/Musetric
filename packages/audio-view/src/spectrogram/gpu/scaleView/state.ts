import { createParams, ScaleViewParams, StateParams } from './params';
import { createPipeline } from './pipeline';

export type State = {
  pipeline: GPUComputePipeline;
  params: StateParams;
  bindGroup: GPUBindGroup;
  configure: (
    signal: GPUBuffer,
    texture: GPUTextureView,
    value: ScaleViewParams,
  ) => void;
  destroy: () => void;
};

export const createState = (device: GPUDevice) => {
  const pipeline = createPipeline(device);
  const params = createParams(device);

  const state: State = {
    pipeline,
    params,
    bindGroup: undefined!,
    configure: (signal, texture, value) => {
      params.write(value);
      state.bindGroup = device.createBindGroup({
        label: 'scale-view-column-bind-group',
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: signal } },
          { binding: 1, resource: texture },
          { binding: 2, resource: { buffer: params.buffer } },
        ],
      });
    },
    destroy: () => {
      state.params.destroy();
    },
  };
  return state;
};
