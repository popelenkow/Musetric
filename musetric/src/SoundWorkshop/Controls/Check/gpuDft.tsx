/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { createTimingHelper } from '../../../Karaoke/Components/TimingHelper';
import { check, createSinus, frequency, width, windowSize, workgroupSize } from './common';

const fftShaderCode = `
    @group(0) @binding(0) var<storage, read> input: array<f32>;
    @group(0) @binding(1) var<storage, read_write> output: array<f32>;
    @group(0) @binding(2) var<storage, read> cosTable: array<f32>;
    @group(0) @binding(3) var<storage, read> sinTable: array<f32>;

    @compute @workgroup_size(${workgroupSize})
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
        let idx = global_id.x;
        let windowSize = ${windowSize}u;
        let frequencySize = windowSize / 2;

        let y = idx / frequencySize;
        let inputOffset = y * windowSize;
        let outputOffset = y * frequencySize;

        let frequency = idx % frequencySize;
        var real: f32 = 0.0;
        var imag: f32 = 0.0;
        for (var i: u32 = 0u; i < windowSize; i = i + 1u) {
            let phiIndex = (frequency * i) % windowSize;
            let phi = -2.0 * 3.14159265359 * f32(phiIndex) / f32(windowSize);
            let value = input[inputOffset + i];
            real += value * cos(phi);
            imag += value * sin(phi);
        }

        let value = sqrt(real * real + imag * imag) / f32(frequencySize);
        output[outputOffset + frequency] = value;
    }
`;

export const createGpuDft = async () => {
    const input = createSinus();
    const output = new Float32Array(frequency * width);
    const table = {
        cos: new Float32Array(Array.from({ length: windowSize }).map((_, i) => Math.cos((-2 * Math.PI * i) / windowSize))),
        sin: new Float32Array(Array.from({ length: windowSize }).map((_, i) => Math.sin((-2 * Math.PI * i) / windowSize))),
    };

    if (!navigator.gpu) throw new Error('WebGPU not supported on this browser.');

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error('need a browser that supports WebGPU');

    const device = await adapter.requestDevice({
        requiredFeatures: ['timestamp-query'],
    });
    if (!device) throw new Error('need a browser that supports WebGPU');

    const inputBuffer = device.createBuffer({
        label: 'computeInputBuffer',
        size: input.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const outputBuffer = device.createBuffer({
        label: 'computeOutputBuffer',
        size: output.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
    });
    const readBuffer = device.createBuffer({
        size: output.byteLength,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    const cosTableBuffer = device.createBuffer({
        label: 'cosTableBuffer',
        size: table.cos.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const sinTableBuffer = device.createBuffer({
        label: 'sinTableBuffer',
        size: table.sin.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const computePipeline = device.createComputePipeline({
        label: 'computePipeline',
        layout: device.createPipelineLayout({
            label: 'computePipelineLayout',
            bindGroupLayouts: [
                device.createBindGroupLayout({
                    label: 'computeBindGroupLayout',
                    entries: [
                        {
                            binding: 0,
                            visibility: GPUShaderStage.COMPUTE,
                            buffer: {
                                type: 'read-only-storage',
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
                            buffer: {
                                type: 'read-only-storage',
                                hasDynamicOffset: false,
                            },
                        },
                        {
                            binding: 3,
                            visibility: GPUShaderStage.COMPUTE,
                            buffer: {
                                type: 'read-only-storage',
                                hasDynamicOffset: false,
                            },
                        },
                    ],
                }),
            ],
        }),
        compute: {
            module: device.createShaderModule({
                label: 'computeShaderCode',
                code: fftShaderCode,
            }),
            entryPoint: 'main',
        },
    });

    const bindGroup = device.createBindGroup({
        label: 'computeBindGroup',
        layout: computePipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: inputBuffer,
                },
            },
            {
                binding: 1,
                resource: {
                    buffer: outputBuffer,
                },
            },
            {
                binding: 2,
                resource: {
                    buffer: cosTableBuffer,
                },
            },
            {
                binding: 3,
                resource: {
                    buffer: sinTableBuffer,
                },
            },
        ],
    });

    const timingHelper = createTimingHelper(device);

    return {
        render: async (): Promise<void> => {
            console.time('gpuDftJ');
            const commandEncoder = device.createCommandEncoder();
            device.queue.writeBuffer(inputBuffer, 0, input);
            device.queue.writeBuffer(cosTableBuffer, 0, table.cos);
            device.queue.writeBuffer(sinTableBuffer, 0, table.sin);
            const passEncoder = timingHelper.beginComputePass(commandEncoder, {});
            // const passEncoder = commandEncoder.beginComputePass({});
            passEncoder.setPipeline(computePipeline);
            passEncoder.setBindGroup(0, bindGroup);
            passEncoder.dispatchWorkgroups(Math.ceil(input.length / workgroupSize));
            passEncoder.end();
            commandEncoder.copyBufferToBuffer(outputBuffer, 0, readBuffer, 0, output.byteLength);
            device.queue.submit([commandEncoder.finish()]);
            await device.queue.onSubmittedWorkDone();

            await readBuffer.mapAsync(GPUMapMode.READ);
            const arrayBuffer = readBuffer.getMappedRange();
            const outputArray = new Float32Array(arrayBuffer);
            console.timeEnd('gpuDftJ');

            const time = await timingHelper.getResult();
            console.log(`gpuDftS: ${time / 1_000_000} ms`);
            check(outputArray);
            readBuffer.unmap();
        },
    };
};
