import { createBindGroup } from './bindGroup';
import { createBuffers, FilterWaveParams } from './buffers';
import { createPipeline } from './pipeline';

const workgroupSize = 64;

export type FilterWave = {
  run: (encoder: GPUCommandEncoder, buffer: GPUBuffer) => void;
  writeParams: (params: FilterWaveParams) => void;
  destroy: () => void;
};

export const createFilterWave = (
  device: GPUDevice,
  timestampWrites?: GPUComputePassTimestampWrites,
): FilterWave => {
  const pipeline = createPipeline(device);
  const buffers = createBuffers(device);

  return {
    run: (encoder, buffer) => {
      const { windowSize, windowCount } = buffers.paramsValue;
      const xCount = Math.ceil(windowSize / workgroupSize);
      const bindGroup = createBindGroup(device, pipeline, buffers, buffer);
      const pass = encoder.beginComputePass({
        label: 'filter-wave-pass',
        timestampWrites,
      });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.dispatchWorkgroups(xCount, windowCount);
      pass.end();
    },
    writeParams: buffers.writeParams,
    destroy: () => {
      buffers.destroy();
    },
  };
};
