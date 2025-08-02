import { ComplexGpuBuffer } from '../../../common';
import { ExtPipelineConfig } from '../../pipeline';
import { createParams, StateParams } from './params';
import { createPipeline } from './pipeline';

export type Config = Pick<
  ExtPipelineConfig,
  'windowSize' | 'windowCount' | 'zeroPaddingFactor'
>;

export type State = {
  pipeline: GPUComputePipeline;
  config: Config;
  params: StateParams;
  bindGroup: GPUBindGroup;
  configure: (signal: ComplexGpuBuffer, config: Config) => void;
  destroy: () => void;
};

export const createState = (device: GPUDevice) => {
  const pipeline = createPipeline(device);
  const params = createParams(device);

  const ref: State = {
    pipeline,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    config: undefined!,
    params,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bindGroup: undefined!,
    configure: (signal, config) => {
      ref.config = config;
      ref.params.write(config);
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
