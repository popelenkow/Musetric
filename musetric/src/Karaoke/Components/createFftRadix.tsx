/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { width, windowSize, workgroupSize } from './common';
import { createGraph } from './graph';

const fftShaderCode = `
    @group(0) @binding(0) var<storage, read_write> realArray: array<f32>;
    @group(0) @binding(1) var<storage, read_write> imagArray: array<f32>;

    const workgroupSize = ${workgroupSize}u;
    const windowSize = ${windowSize}u;
    const frequencySize = windowSize / 2;

    @compute @workgroup_size(workgroupSize)
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
        let line = global_id.x;

        let windowOffset = line * windowSize;
        let frequencyOffset = line * frequencySize;

        // Cooley-Tukey FFT
        let wk = -2.0 * 3.14159265359 / f32(windowSize);
        for (var size: u32 = 2; size <= windowSize; size = size << 1) {
            let halfSize = size >> 1;
            let tableStep = windowSize / size;
            for (var m: u32 = 0; m < windowSize; m = m + size) {
                for (var k: u32 = 0; k < halfSize; k++) {
                    let tableIndex = k * tableStep;
                    let phi = wk * f32(tableIndex);
                    let cosV = cos(phi);
                    let sinV = sin(phi);

                    let i = m + k;
                    let j = i + halfSize;

                    let uReal = realArray[windowOffset + i];
                    let uImag = imagArray[windowOffset + i];

                    let tReal = cosV * realArray[windowOffset + j] - sinV * imagArray[windowOffset + j];
                    let tImag = sinV * realArray[windowOffset + j] + cosV * imagArray[windowOffset + j];

                    realArray[windowOffset + i] = uReal + tReal;
                    imagArray[windowOffset + i] = uImag + tImag;
                    realArray[windowOffset + j] = uReal - tReal;
                    imagArray[windowOffset + j] = uImag - tImag;
                }
            }
        }
    }
`;

export const createFftRadix = (
    device: GPUDevice,
    realArrayBuffer: GPUBuffer,
    imagArrayBuffer: GPUBuffer,
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
    const computePipeline = device.createComputePipeline({
        label: 'fftRadixPipeline',
        layout: device.createPipelineLayout({
            label: 'fftRadixPipelineLayout',
            bindGroupLayouts: [
                device.createBindGroupLayout({
                    label: 'fftRadixBindGroupLayout',
                    entries: [
                        {
                            binding: 0,
                            visibility: GPUShaderStage.COMPUTE,
                            buffer: {
                                type: 'storage',
                                hasDynamicOffset: false,
                            },
                        },
                        {
                            binding: 1,
                            visibility: GPUShaderStage.COMPUTE,
                            buffer: {
                                type: 'storage',
                                hasDynamicOffset: false,
                            },
                        },
                    ],
                }),
            ],
        }),
        compute: {
            module: device.createShaderModule({
                label: 'fftRadixShaderCode',
                code: fftShaderCode,
            }),
            entryPoint: 'main',
        },
    });

    const bindGroup = device.createBindGroup({
        label: 'fftRadixBindGroup',
        layout: computePipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: realArrayBuffer,
                },
            },
            {
                binding: 1,
                resource: {
                    buffer: imagArrayBuffer,
                },
            },
        ],
    });

    const graph = createGraph(device);

    return {
        render: (commandEncoder: GPUCommandEncoder): void => {
            const passEncoder = graph.beginComputePass(commandEncoder, {});
            passEncoder.setPipeline(computePipeline);
            passEncoder.setBindGroup(0, bindGroup);
            passEncoder.dispatchWorkgroups(Math.ceil(width / workgroupSize));
            passEncoder.end();
        },
        end: async (elapsedTime: number): Promise<void> => {
            await graph.render('cpu', elapsedTime, 'fftRadix');
        },
    };
};
