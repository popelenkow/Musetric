import { Parameters } from '../../parameters';
import { createBindGroup } from './bindGroup';
import { createBuffers } from './buffers';
import { createPipeline } from './pipeline';

const workgroupSize = 16;

export type ViewSize = {
  width: number;
  height: number;
};

export type LogSlicerRun = (
  encoder: GPUCommandEncoder,
  magnitude: GPUBuffer,
  parameters: Parameters,
  viewSize: ViewSize,
  texture: GPUTextureView,
) => void;

export type LogSlicer = {
  run: LogSlicerRun;
  destroy: () => void;
};

export const createLogSlicer = (
  device: GPUDevice,
  windowSize: number,
): LogSlicer => {
  const pipeline = createPipeline(device);
  const buffers = createBuffers(device, windowSize);

  return {
    run: (encoder, magnitude, parameters, viewSize, texture) => {
      buffers.writeParams(parameters, viewSize);
      const bindGroup = createBindGroup(
        device,
        pipeline,
        magnitude,
        buffers,
        texture,
      );

      const pass = encoder.beginComputePass({ label: 'drawer-column-pass' });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      const xGroups = Math.ceil(viewSize.width / workgroupSize);
      const yGroups = Math.ceil(viewSize.height / workgroupSize);
      pass.dispatchWorkgroups(xGroups, yGroups);
      pass.end();
    },
    destroy: () => {
      buffers.destroy();
    },
  };
};
