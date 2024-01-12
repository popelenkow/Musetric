/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { width, windowSize, workgroupSize } from './common';
import { createGraph } from './graph';

const fftShaderCode = `
    @group(0) @binding(0) var<storage, read> input: array<f32>;
    @group(0) @binding(1) var<storage, read> windowFilter: array<f32>;
    @group(0) @binding(2) var<storage, read> bitReverse: array<u32>;
    @group(0) @binding(3) var<storage, read_write> realArray: array<f32>;
    @group(0) @binding(4) var<storage, read_write> imagArray: array<f32>;

    const workgroupSize = ${workgroupSize}u;
    const windowSize = ${windowSize}u;
    const frequencySize = windowSize / 2;

    @compute @workgroup_size(workgroupSize)
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
        let line = global_id.x;

        let windowOffset = line * windowSize;
        let frequencyOffset = line * frequencySize;

        // Bit-reversal permutation
        for (var i: u32 = 0; i < windowSize; i = i + 1) {
            let reversedIndex = bitReverse[i];
            realArray[windowOffset + i] = input[windowOffset + reversedIndex] * windowFilter[reversedIndex];
            imagArray[windowOffset + i] = 0.0;
        }
    }
`;

export const createFftPrepare = (
    device: GPUDevice,
    inputData: Float32Array,
    realArrayBuffer: GPUBuffer,
    imagArrayBuffer: GPUBuffer,
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
    const hannWindowFilter = (): Float32Array => {
        const filter = new Float32Array(windowSize);
        for (let i = 0; i < windowSize; i++) {
            filter[i] = 0.5 * (1 - Math.cos((Math.PI * 2 * i) / (windowSize - 1)));
        }
        return filter;
    };
    const windowFilter = hannWindowFilter();

    const getBitReverse = (): Uint32Array => {
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
    // const getBitReverse = (): Uint32Array => {
    //     // Так как radix-4, используем log2(n)/2 для получения основания логарифма по основанию 4
    //     const log4n = Math.log2(windowSize) / 2;

    //     const output = new Uint32Array(windowSize);
    //     for (let i = 0; i < windowSize; i++) {
    //         let reversed = 0;
    //         let x = i;
    //         for (let j = 0; j < log4n; j++) {
    //             // Сдвигаем reversed на 2 бита влево и добавляем 2 младших бита x
    //             reversed = (reversed << 2) | (x & 0x3);
    //             // Сдвигаем x на 2 бита вправо
    //             x >>= 2;
    //         }
    //         output[i] = reversed;
    //     }

    //     return output;
    // };
    const bitReverse = getBitReverse();

    const inputBuffer = device.createBuffer({
        label: 'fftPrepareInputBuffer',
        size: inputData.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const windowFilterBuffer = device.createBuffer({
        label: 'windowFilterBuffer',
        size: windowFilter.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(windowFilterBuffer, 0, windowFilter);

    const bitReverseBuffer = device.createBuffer({
        label: 'bitReverseBuffer',
        size: bitReverse.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(bitReverseBuffer, 0, bitReverse);

    const computePipeline = device.createComputePipeline({
        label: 'fftPreparePipeline',
        layout: device.createPipelineLayout({
            label: 'fftPreparePipelineLayout',
            bindGroupLayouts: [
                device.createBindGroupLayout({
                    label: 'fftPrepareBindGroupLayout',
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
                                type: 'read-only-storage',
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
                                type: 'storage',
                                hasDynamicOffset: false,
                            },
                        },
                        {
                            binding: 4,
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
                label: 'fftPrepareShaderCode',
                code: fftShaderCode,
            }),
            entryPoint: 'main',
        },
    });

    const bindGroup = device.createBindGroup({
        label: 'fftPrepareBindGroup',
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
                    buffer: windowFilterBuffer,
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
                    buffer: realArrayBuffer,
                },
            },
            {
                binding: 4,
                resource: {
                    buffer: imagArrayBuffer,
                },
            },
        ],
    });

    const graph = createGraph(device);

    return {
        render: (commandEncoder: GPUCommandEncoder): void => {
            device.queue.writeBuffer(inputBuffer, 0, inputData);
            const passEncoder = graph.beginComputePass(commandEncoder, {});
            passEncoder.setPipeline(computePipeline);
            passEncoder.setBindGroup(0, bindGroup);
            passEncoder.dispatchWorkgroups(Math.ceil(width / workgroupSize));
            passEncoder.end();
        },
        end: async (elapsedTime: number): Promise<void> => {
            await graph.render('skip', elapsedTime, 'fftPrepare');
        },
    };
};
