import { ComplexGpuBuffer } from '../../common';
import { GpuFourierParams } from '../gpuFourier';
import { assertWindowSizePowerOfTwo } from '../isPowerOfTwo';
import { createParams, StateParams } from './params';
import { createReversePipeline, createTransformPipeline } from './pipeline';
import { createReverseTable } from './reverseTable';
import { createTrigTable } from './trigTable';

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
  configure: (signal: ComplexGpuBuffer, value: GpuFourierParams) => void;
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

  const state: State = {
    pipelines,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bindGroups: undefined!,
    params,
    configure: (signal, value) => {
      assertWindowSizePowerOfTwo(value.windowSize);
      params.write(value);
      reverseTable.resize(params.shader.reverseWidth);
      trigTable.resize(value.windowSize);
      state.bindGroups = {
        reverse: device.createBindGroup({
          label: 'fft4-reverse-bind-group',
          layout: pipelines.reverse.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: signal.real } },
            { binding: 1, resource: { buffer: signal.imag } },
            { binding: 2, resource: { buffer: reverseTable.buffer } },
            { binding: 3, resource: { buffer: params.buffer } },
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

  return state;
};
