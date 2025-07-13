import { Parameters } from '../../parameters';
import { Drawer } from '../drawer';
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
  drawer: Drawer,
) => void;

export type LogSlicer = {
  run: LogSlicerRun;
  destroy: () => void;
};

export type CreateLogSlicerOptions = {
  device: GPUDevice;
  windowSize: number;
  timestampWrites?: GPUComputePassTimestampWrites;
};

export const createLogSlicer = (options: CreateLogSlicerOptions): LogSlicer => {
  const { device, windowSize, timestampWrites } = options;
  const pipeline = createPipeline(device);
  const buffers = createBuffers(device, windowSize);

  return {
    run: (encoder, magnitude, parameters, drawer) => {
      const viewSize: ViewSize = {
        width: drawer.width,
        height: drawer.height,
      };
      const texture = drawer.getTextureView();
      buffers.writeParams(parameters, viewSize);
      const bindGroup = createBindGroup(
        device,
        pipeline,
        magnitude,
        buffers,
        texture,
      );

      const pass = encoder.beginComputePass({
        label: 'drawer-column-pass',
        timestampWrites,
      });
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
