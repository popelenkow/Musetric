import { createState, State } from './state';

const workgroupSize = 16;

export type ScaleView = {
  run: (encoder: GPUCommandEncoder) => void;
  configure: State['configure'];
  destroy: State['destroy'];
};

export const createScaleView = (
  device: GPUDevice,
  timestampWrites?: GPUComputePassTimestampWrites,
): ScaleView => {
  const state = createState(device);

  return {
    run: (encoder) => {
      const { width, height } = state.params.value;
      const xGroups = Math.ceil(width / workgroupSize);
      const yGroups = Math.ceil(height / workgroupSize);

      const pass = encoder.beginComputePass({
        label: 'scale-view-column-pass',
        timestampWrites,
      });
      pass.setPipeline(state.pipeline);
      pass.setBindGroup(0, state.bindGroup);
      pass.dispatchWorkgroups(xGroups, yGroups);
      pass.end();
    },
    configure: state.configure,
    destroy: state.destroy,
  };
};
