/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { width, windowSize, workgroupSize } from './common';
import { createGraph } from './graph';

const fftShaderCode = `
    @group(0) @binding(0) var<storage, read_write> realArray: array<f32>;
    @group(0) @binding(1) var<storage, read_write> imagArray: array<f32>;
    @group(0) @binding(2) var myTexture: texture_storage_2d<rgba8unorm, write>;

    const workgroupSize = ${workgroupSize}u;
    const windowSize = ${windowSize}u;
    const frequencySize = windowSize / 2;

    @compute @workgroup_size(workgroupSize)
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
        let line = global_id.x;

        let windowOffset = line * windowSize;
        let frequencyOffset = line * frequencySize;

        for (var frequency: u32 = 0u; frequency < frequencySize; frequency++) {
            let real = realArray[windowOffset + frequency];
            let imag = imagArray[windowOffset + frequency];
            let rawValue = sqrt(real * real + imag * imag) / f32(windowSize);
            let value = log2(rawValue * 18.0 + 1.0) / log2(10.0);
            let coord = vec2<i32>(i32(line), i32(frequency));
            let value4 = vec4<f32>(value, value, value, 1.0);
            textureStore(myTexture, coord, value4);
        }
    }
`;

export const createFftModule = (
    device: GPUDevice,
    realArrayBuffer: GPUBuffer,
    imagArrayBuffer: GPUBuffer,
    outputTextureView: GPUTextureView,
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
    const computePipeline = device.createComputePipeline({
        label: 'fftModulePipeline',
        layout: device.createPipelineLayout({
            label: 'fftModulePipelineLayout',
            bindGroupLayouts: [
                device.createBindGroupLayout({
                    label: 'fftModuleBindGroupLayout',
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
                        {
                            binding: 2,
                            visibility: GPUShaderStage.COMPUTE,
                            storageTexture: {
                                access: 'write-only',
                                format: 'rgba8unorm',
                            },
                        },
                    ],
                }),
            ],
        }),
        compute: {
            module: device.createShaderModule({
                label: 'fftModuleShaderCode',
                code: fftShaderCode,
            }),
            entryPoint: 'main',
        },
    });

    const bindGroup = device.createBindGroup({
        label: 'fftModuleBindGroup',
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
            {
                binding: 2,
                resource: outputTextureView,
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
            await graph.render('skip', elapsedTime, 'fftModule');
        },
    };
};
