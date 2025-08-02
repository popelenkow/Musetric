import { ExtPipelineConfig } from '../../pipeline';
import { createParams, StateParams } from './params';
import { createPipeline } from './pipeline';
import { createWindowFilter } from './windowFilter';

export type Config = Pick<
  ExtPipelineConfig,
  'windowSize' | 'windowCount' | 'zeroPaddingFactor' | 'windowFilter'
>;

export type State = {
  pipeline: GPUComputePipeline;
  config: Config;
  params: StateParams;
  bindGroup: GPUBindGroup;
  configure: (signal: GPUBuffer, config: Config) => void;
  destroy: () => void;
};
export const createState = (device: GPUDevice): State => {
  const pipeline = createPipeline(device);
  const params = createParams(device);
  const windowFilter = createWindowFilter(device);

  const ref: State = {
    pipeline,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    config: undefined!,
    params,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bindGroup: undefined!,
    configure: (signal, config) => {
      ref.config = config;
      params.write(config);
      windowFilter.configure(config);
      ref.bindGroup = device.createBindGroup({
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
  return ref;
};
