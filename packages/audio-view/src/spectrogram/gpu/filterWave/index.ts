import { createState, State } from './state';

const workgroupSize = 64;

export type FilterWave = {
  run: (encoder: GPUCommandEncoder) => void;
  configure: State['configure'];
  destroy: State['destroy'];
};

export const createFilterWave = (
  device: GPUDevice,
  timestampWrites?: GPUComputePassTimestampWrites,
): FilterWave => {
  const state = createState(device);
  return {
    run: (encoder) => {
      const { windowSize, windowCount } = state.params.value;
      const xCount = Math.ceil(windowSize / workgroupSize);
      const pass = encoder.beginComputePass({
        label: 'filter-wave-pass',
        timestampWrites,
      });
      pass.setPipeline(state.pipeline);
      pass.setBindGroup(0, state.bindGroup);
      pass.dispatchWorkgroups(xCount, windowCount);
      pass.end();
    },
    configure: state.configure,
    destroy: state.destroy,
  };
};
