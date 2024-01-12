/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createSinus } from './common';
import { createFftWebGPU } from './createFftWebGPU';
import { createSpectrogramRender } from './createSpectrogramRender';

type WebGpuInstance = {
    render: () => Promise<void>,
};
export const createWebGpu = (
    device: GPUDevice,
    context: GPUCanvasContext,
    canvas: HTMLCanvasElement,
): WebGpuInstance => {
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device,
        format: presentationFormat,
    });

    const inputData = createSinus();

    const fftWebGPU = createFftWebGPU(device, inputData);
    // eslint-disable-next-line max-len
    const spectrogram = createSpectrogramRender(device, context, canvas, fftWebGPU.outputTextureView, presentationFormat);

    const result: WebGpuInstance = {
        render: async () => {
            const startTime = performance.now();

            const commandEncoder = device.createCommandEncoder();
            fftWebGPU.render(commandEncoder);
            spectrogram.render(commandEncoder);
            device.queue.submit([commandEncoder.finish()]);

            const endTime = performance.now();
            const elapsedTime = endTime - startTime;

            await fftWebGPU.end(elapsedTime);
        },
    };
    return result;
};
