import { ComplexGpuBuffer } from '../../common/index.js';
import { FourierConfig } from '../config.js';
import { assertWindowSizePowerOfTwo } from '../isPowerOfTwo.js';
import { createParams, StateParams } from './params.js';
import { createReversePipeline, createTransformPipeline } from './pipeline.js';
import { createReverseTable } from './reverseTable.js';
import { createTrigTable } from './trigTable.js';

type Pipelines = {
  reverse: GPUComputePipeline;
  transform: GPUComputePipeline;
};
type BindGroups = {
  reverse: GPUBindGroup;
  transform: GPUBindGroup;
};
export type State = {
  pipelines: Pipelines;
  bindGroups: BindGroups;
  params: StateParams;
  configure: (signal: ComplexGpuBuffer, config: FourierConfig) => void;
  destroy: () => void;
};
export const createState = (device: GPUDevice) => {
  const pipelines: Pipelines = {
    reverse: createReversePipeline(device),
    transform: createTransformPipeline(device),
  };

  const params = createParams(device);
  const reverseTable = createReverseTable(device);
  const trigTable = createTrigTable(device);

  const ref: State = {
    pipelines,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bindGroups: undefined!,
    params,
    configure: (signal, config) => {
      const { windowSize } = config;
      assertWindowSizePowerOfTwo(windowSize);
      params.write(config);
      reverseTable.resize(params.value.reverseWidth);
      trigTable.resize(windowSize);
      ref.bindGroups = {
        reverse: device.createBindGroup({
          label: 'fft4-reverse-bind-group',
          layout: pipelines.reverse.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: signal.real } },
            { binding: 1, resource: { buffer: reverseTable.buffer } },
            { binding: 2, resource: { buffer: params.buffer } },
          ],
        }),
        transform: device.createBindGroup({
          label: 'fft4-transform-bind-group',
          layout: pipelines.transform.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: signal.real } },
            { binding: 1, resource: { buffer: signal.imag } },
            { binding: 2, resource: { buffer: trigTable.buffer } },
            { binding: 3, resource: { buffer: params.buffer } },
          ],
        }),
      };
    },
    destroy: () => {
      params.destroy();
      reverseTable.destroy();
      trigTable.destroy();
    },
  };
  return ref;
};
