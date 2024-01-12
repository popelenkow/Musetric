/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { setSinus, textureSize, width, windowSize } from './common';
import { createFftModule } from './createFftModule';
import { createFftPrepare } from './createFftPrepare';
import { createFftRadix } from './createFftRadix';
import { createGraph } from './graph';

export const createFftWebGPU = (
    device: GPUDevice,
    inputData: Float32Array,
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
    const realArrayBuffer = device.createBuffer({
        label: 'realArrayBuffer',
        size: windowSize * width * Float32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const imagArrayBuffer = device.createBuffer({
        label: 'imageArrayBuffer',
        size: windowSize * width * Float32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const outputTexture = device.createTexture({
        label: 'computeOutputTexture',
        size: textureSize,
        format: 'rgba8unorm',
        usage: (
            GPUTextureUsage.TEXTURE_BINDING
            | GPUTextureUsage.STORAGE_BINDING
            | GPUTextureUsage.COPY_DST
            | GPUTextureUsage.COPY_SRC
            | GPUTextureUsage.RENDER_ATTACHMENT
        ),
    });

    const outputTextureView = outputTexture.createView({
        label: 'outputTextureView',
    });

    const fftPrepare = createFftPrepare(device, inputData, realArrayBuffer, imagArrayBuffer);
    const fftModule = createFftModule(device, realArrayBuffer, imagArrayBuffer, outputTextureView);
    const fftRadix = createFftRadix(device, realArrayBuffer, imagArrayBuffer);

    let phase = 0;
    return {
        outputTexture,
        outputTextureView,
        render: (commandEncoder: GPUCommandEncoder): void => {
            setSinus(inputData, phase);
            phase = (phase + 1) % 500;
            fftPrepare.render(commandEncoder);
            fftRadix.render(commandEncoder);
            fftModule.render(commandEncoder);
        },
        end: async (elapsedTime: number): Promise<void> => {
            await fftPrepare.end(elapsedTime);
            await fftRadix.end(elapsedTime);
            await fftModule.end(elapsedTime);
        },
    };
};
