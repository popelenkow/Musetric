import { WindowFilterKey } from '../../windowFilters';
import { createParams, StateParams } from './params';
import { createPipeline } from './pipeline';
import { createWindowFilter } from './windowFilter';

export type State = {
  pipeline: GPUComputePipeline;
  params: StateParams;
  bindGroup: GPUBindGroup;
  configure: (
    signal: GPUBuffer,
    windowSize: number,
    windowCount: number,
    windowFilterKey: WindowFilterKey,
    zeroPaddingFactor: number,
  ) => void;
  destroy: () => void;
};
export const createState = (device: GPUDevice): State => {
  const pipeline = createPipeline(device);
  const params = createParams(device);
  const windowFilter = createWindowFilter(device);

  const ref: State = {
    pipeline,
    params,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bindGroup: undefined!,
    configure: (
      signal,
      windowSize,
      windowCount,
      windowFilterKey,
      zeroPaddingFactor,
    ) => {
      params.write({
        windowSize,
        windowCount,
        zeroPaddingFactor,
      });
      windowFilter.configure(windowSize, windowFilterKey);
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
