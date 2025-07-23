import { createCallLatest } from '../../common';
import { GpuFourierMode } from '../../fourier';
import { Pipeline, PipelineConfigureOptions } from '../pipeline';
import { createPipelineState } from './pipelineState';
import { PipelineProfile } from './pipelineTimer';

export type CreatePipelineOptions = {
  device: GPUDevice;
  fourierMode: GpuFourierMode;
  canvas: HTMLCanvasElement;
  onProfile?: (profile: PipelineProfile) => void;
};
export const createPipeline = (
  options: CreatePipelineOptions & PipelineConfigureOptions,
): Pipeline => {
  const { device } = options;

  let isConfigureRequested = true;

  const state = createPipelineState(options);

  const writeBuffers = state.timer.wrap('writeBuffers', (progress: number) => {
    const { signal, signalArray } = state.buffers;
    device.queue.writeBuffer(signal.real, 0, signalArray.real);
    device.queue.writeBuffer(signal.imag, 0, signalArray.imag);
    state.draw.writeProgress(progress);
  });

  const createCommand = state.timer.wrap('createCommand', () => {
    const encoder = device.createCommandEncoder({
      label: 'pipeline-render-encoder',
    });
    state.filterWave.run(encoder);
    state.fourier.forward(encoder);
    state.magnitudify.run(encoder);
    state.decibelify.run(encoder);
    state.scaleView.run(encoder);
    state.draw.run(encoder);
    state.timer.resolve(encoder);
    return encoder.finish();
  });

  const submitCommand = state.timer.wrapAsync(
    'submitCommand',
    async (command: GPUCommandBuffer) => {
      device.queue.submit([command]);
      await device.queue.onSubmittedWorkDone();
    },
  );

  const render = state.timer.wrapAsync(
    'total',
    async (wave: Float32Array, progress: number) => {
      if (isConfigureRequested) {
        isConfigureRequested = false;
        state.configure();
      }
      state.sliceWaves.run(wave, state.buffers.signalArray);
      writeBuffers(progress);
      const command = createCommand();
      await submitCommand(command);
    },
  );

  return {
    render: createCallLatest(async (wave, progress) => {
      await render(wave, progress);
      await state.timer.finish();
    }),
    resize: () => {
      isConfigureRequested = true;
    },
    destroy: () => {
      state.destroy();
    },
  };
};
