import { createBindGroup } from './bindGroup';
import { createBuffers, FilterWaveParams } from './buffers';
import { createPipeline } from './pipeline';

const workgroupSize = 64;

export type FilterWave = {
  run: (encoder: GPUCommandEncoder, signal: GPUBuffer) => void;
  writeParams: (params: FilterWaveParams) => void;
  destroy: () => void;
};

export const createFilterWave = (
  device: GPUDevice,
  windowSize: number,
  timestampWrites?: GPUComputePassTimestampWrites,
): FilterWave => {
  const pipeline = createPipeline(device);
  const buffers = createBuffers(device, windowSize);

  return {
    run: (encoder, signal) => {
      const { windowCount } = buffers.paramsValue;
      const xCount = Math.ceil(windowSize / workgroupSize);
      const bindGroup = createBindGroup(device, pipeline, buffers, signal);
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
