import { CpuMarker } from '../../../common';
import { createState, State } from './state';

const workgroupSize = 64;

export type SliceWaves = {
  run: (encoder: GPUCommandEncoder) => void;
  configure: State['configure'];
  write: State['write'];
  destroy: () => void;
};

export const createSliceWaves = (
  device: GPUDevice,
  marker?: GPUComputePassTimestampWrites,
  writeBuffersMarker?: CpuMarker,
): SliceWaves => {
  const state = createState(device, writeBuffersMarker);

  return {
    run: (encoder) => {
      const { paddedWindowSize, windowCount } = state.params.value;
      const xGroups = Math.ceil(paddedWindowSize / workgroupSize);
      const pass = encoder.beginComputePass({
        label: 'slice-waves-pass',
        timestampWrites: marker,
      });
      pass.setPipeline(state.pipeline);
      pass.setBindGroup(0, state.bindGroup);
      pass.dispatchWorkgroups(xGroups, windowCount);
      pass.end();
    },
    configure: state.configure,
    write: state.write,
    destroy: () => {
      state.destroy();
    },
  };
};
