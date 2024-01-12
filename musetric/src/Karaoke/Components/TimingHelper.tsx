type TimingHelper = {
    beginRenderPass: (
        encoder: GPUCommandEncoder,
        descriptor: GPURenderPassDescriptor
    ) => GPURenderPassEncoder,
    beginComputePass: (
        encoder: GPUCommandEncoder,
        descriptor: GPUComputePassDescriptor
    ) => GPUComputePassEncoder,
    getResult: () => Promise<number>,
};
export const createTimingHelper = (device: GPUDevice): TimingHelper => {
    const canTimestamp: boolean = device.features.has('timestamp-query');
    const querySet: GPUQuerySet = device.createQuerySet({
        type: 'timestamp',
        count: 2,
    });
    const resolveBuffer: GPUBuffer = device.createBuffer({
        size: querySet.count * 8,
        usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
    });
    let resultBuffer: GPUBuffer | undefined;
    const resultBuffers: GPUBuffer[] = [];
    let state: 'free' | 'need resolve' | 'wait for result' = 'free';

    const resolveTiming = (
        encoder: GPUCommandEncoder,
    ): void => {
        if (!canTimestamp) {
            return;
        }
        if (state !== 'need resolve') {
            throw new Error('must call addTimestampToPass');
        }
        state = 'wait for result';

        resultBuffer = resultBuffers.pop() || device.createBuffer({
            size: resolveBuffer.size,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
        });

        encoder.resolveQuerySet(querySet, 0, querySet.count, resolveBuffer, 0);
        encoder.copyBufferToBuffer(resolveBuffer, 0, resultBuffer, 0, resultBuffer.size);
    };

    const beginTimestampPass = <T extends GPURenderPassEncoder | GPUComputePassEncoder>(
        encoder: GPUCommandEncoder,
        fn: (timestamp?: GPUComputePassTimestampWrites) => T,
    ): T => {
        if (!canTimestamp) return fn();

        if (state !== 'free') {
            throw new Error('state not free');
        }
        state = 'need resolve';

        const pass = fn({
            querySet,
            beginningOfPassWriteIndex: 0,
            endOfPassWriteIndex: 1,
        });

        const originalEnd = pass.end.bind(pass);
        pass.end = (): undefined => {
            originalEnd();
            resolveTiming(encoder);
        };
        return pass;
    };

    const getResult = async (): Promise<number> => {
        if (!canTimestamp) {
            return 0;
        }
        if (state !== 'wait for result') {
            throw new Error('must call resolveTiming');
        }
        state = 'free';

        await resultBuffer!.mapAsync(GPUMapMode.READ);
        const times: BigInt64Array = new BigInt64Array(resultBuffer!.getMappedRange());
        const duration: number = Number(times[1] - times[0]);
        resultBuffer!.unmap();
        resultBuffers.push(resultBuffer!);
        return duration;
    };

    return {
        beginRenderPass: (encoder, descriptor) => beginTimestampPass(
            encoder,
            (timestampWrites) => encoder.beginRenderPass({ ...descriptor, timestampWrites }),
        ),
        beginComputePass: (encoder, descriptor) => beginTimestampPass(
            encoder,
            (timestampWrites) => encoder.beginComputePass({ ...descriptor, timestampWrites }),
        ),
        getResult,
    };
};
