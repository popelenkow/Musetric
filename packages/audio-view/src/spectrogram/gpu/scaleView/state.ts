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

  const ref: State = {
    pipeline,
    params,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bindGroup: undefined!,
    configure: (signal, texture, value) => {
      params.write(value);
      ref.bindGroup = device.createBindGroup({
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
      ref.params.destroy();
    },
  };
  return ref;
};
