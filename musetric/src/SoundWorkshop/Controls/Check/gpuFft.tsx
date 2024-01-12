/* eslint-disable no-mixed-operators */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { createTimingHelper } from '../../../Karaoke/Components/TimingHelper';
import { check, createSinus, frequency, width, windowSize, workgroupSize } from './common';

const fftShaderCode = `
    @group(0) @binding(0) var<storage, read> input: array<f32>;
    @group(0) @binding(1) var<storage, read_write> output: array<f32>;
    @group(0) @binding(2) var<storage, read> bitReverse: array<u32>;
    @group(0) @binding(3) var<storage, read> cosTable: array<f32>;
    @group(0) @binding(4) var<storage, read> sinTable: array<f32>;

    const windowSize = ${windowSize}u;
    const frequencySize = windowSize / 2;

    @compute @workgroup_size(${workgroupSize})
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
        let line = global_id.x;

        let inputOffset = line * windowSize;
        let outputOffset = line * frequencySize;

        var realPart: array<f32, ${windowSize}>;
        var imagPart: array<f32, ${windowSize}>;

        // Bit-reversal permutation
        for (var i: u32 = 0; i < windowSize; i = i + 1) {
            let reversedIndex = bitReverse[i];
            realPart[i] = input[inputOffset + reversedIndex];
            imagPart[i] = 0.0;
        }

        // Cooley-Tukey FFT
        let wk = -2.0 * 3.14159265359 / f32(windowSize);
        for (var size: u32 = 2; size <= windowSize; size = size << 1) {
            let halfSize = size >> 1;
            let tableStep = windowSize / size;
            for (var m: u32 = 0; m < windowSize; m = m + size) {
                var tableIndex: u32 = 0;
                for (var k: u32 = 0; k < halfSize; k = k + 1) {
                    let phi = wk * f32(tableIndex);
                    let cosV = cos(phi);
                    let sinV = sin(phi);

                    let i = m + k;
                    let j = i + halfSize;

                    let tReal = cosV * realPart[j] - sinV * imagPart[j];
                    let tImag = sinV * realPart[j] + cosV * imagPart[j];

                    let uReal = realPart[i];
                    let uImag = imagPart[i];

                    realPart[i] = uReal + tReal;
                    imagPart[i] = uImag + tImag;
                    realPart[j] = uReal - tReal;
                    imagPart[j] = uImag - tImag;

                    tableIndex += tableStep;
                }
            }
        }

        for (var frequency: u32 = 0u; frequency < frequencySize; frequency = frequency + 1u) {
            let real = realPart[frequency];
            let imag = imagPart[frequency];
            let value = sqrt(real * real + imag * imag);
            output[outputOffset + frequency] = 2.0 * value / f32(windowSize);
        }
    }
`;

export const createGpuFft = async () => {
    const input = createSinus();
    const output = new Float32Array(frequency * width);

    const getBitReverse = () => {
        const result = new Uint32Array(windowSize);
        let j = 0;
        for (let i = 0; i < windowSize; i++) {
            result[i] = j;
            let m = windowSize >> 1;
            while (m >= 1 && j >= m) {
                j -= m;
                m >>= 1;
            }
            j += m;
        }
        return result;
    };
    const bitReverse = getBitReverse();
    const cosTable = new Float32Array(windowSize / 2);
    const sinTable = new Float32Array(windowSize / 2);
    for (let i = 0; i < windowSize / 2; i++) {
        const angle = -2 * Math.PI * i / windowSize;
        cosTable[i] = Math.cos(angle);
        sinTable[i] = Math.sin(angle);
    }

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
    const bitReverseBuffer = device.createBuffer({
        label: 'bitReverseBuffer',
        size: bitReverse.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(bitReverseBuffer, 0, bitReverse);

    const cosTableBuffer = device.createBuffer({
        label: 'cosTableBuffer',
        size: cosTable.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(cosTableBuffer, 0, cosTable);

    const sinTableBuffer = device.createBuffer({
        label: 'sinTableBuffer',
        size: sinTable.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(sinTableBuffer, 0, sinTable);

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
                        {
                            binding: 4,
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
                    buffer: bitReverseBuffer,
                },
            },
            {
                binding: 3,
                resource: {
                    buffer: cosTableBuffer,
                },
            },
            {
                binding: 4,
                resource: {
                    buffer: sinTableBuffer,
                },
            },
        ],
    });

    const timingHelper = createTimingHelper(device);

    return {
        render: async (): Promise<void> => {
            console.time('gpuFftJ');
            const commandEncoder = device.createCommandEncoder();
            device.queue.writeBuffer(inputBuffer, 0, input);
            const passEncoder = timingHelper.beginComputePass(commandEncoder, {});
            // const passEncoder = commandEncoder.beginComputePass({});
            passEncoder.setPipeline(computePipeline);
            passEncoder.setBindGroup(0, bindGroup);
            passEncoder.dispatchWorkgroups(Math.ceil(width / workgroupSize));
            passEncoder.end();
            commandEncoder.copyBufferToBuffer(outputBuffer, 0, readBuffer, 0, output.byteLength);
            device.queue.submit([commandEncoder.finish()]);
            await device.queue.onSubmittedWorkDone();

            await readBuffer.mapAsync(GPUMapMode.READ);
            const arrayBuffer = readBuffer.getMappedRange();
            const outputArray = new Float32Array(arrayBuffer);
            console.timeEnd('gpuFftJ');

            const time = await timingHelper.getResult();
            console.log(`gpuFftS: ${time / 1_000_000} ms`);
            check(outputArray);
            readBuffer.unmap();
        },
    };
};
