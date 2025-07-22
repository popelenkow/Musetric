import { createState, State } from './state';

export type Decibelify = {
  run: (encoder: GPUCommandEncoder) => void;
  configure: State['configure'];
  destroy: State['destroy'];
};
export const createDecibelify = (
  device: GPUDevice,
  timestampWrites?: GPUComputePassTimestampWrites,
): Decibelify => {
  const state = createState(device);

  return {
    run: (encoder) => {
      const { windowCount } = state.params.value;
      const pass = encoder.beginComputePass({
        label: 'decibelify-pass',
        timestampWrites,
      });
      pass.setPipeline(state.pipeline);
      pass.setBindGroup(0, state.bindGroup);
      pass.dispatchWorkgroups(windowCount);
      pass.end();
    },
    configure: state.configure,
    destroy: state.destroy,
  };
};
