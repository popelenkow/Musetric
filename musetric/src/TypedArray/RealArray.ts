import { RealType, RealTypeMap, realBytesMap, createRealTypeMap } from './RealType';

export type RealArrayLike<
    K extends RealType = RealType,
    B extends ArrayBufferLike = ArrayBufferLike,
> = {
    readonly type: K,
    readonly real: RealTypeMap[K],
    readonly realRaw: B,
};

export type RealArray<K extends RealType = RealType> = RealArrayLike<K, ArrayBuffer>;
export const createRealArray = <K extends RealType>(
    type: K,
    length: number,
): RealArray<K> => {
    const bytes = realBytesMap[type];
    const realRaw = new ArrayBuffer(bytes * length);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const real = createRealTypeMap[type](realRaw, 0, length) as RealTypeMap[K];
    return { real, realRaw, type };
};

export type RealArrayMap = {
    float32: RealArray<'float32'>,
    float64: RealArray<'float64'>,
    uint32: RealArray<'uint32'>,
    uint8: RealArray<'uint8'>,
};

export type SharedRealArray<K extends RealType = RealType> =
    RealArrayLike<K, SharedArrayBuffer>;
export const createSharedRealArray = <K extends RealType>(
    type: K,
    length: number,
): SharedRealArray<K> => {
    const bytes = realBytesMap[type];
    const realRaw = new SharedArrayBuffer(bytes * length);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const real = createRealTypeMap[type](realRaw) as RealTypeMap[K];
    return { real, realRaw, type };
};

export const viewRealArray = <K extends RealType, B extends ArrayBufferLike>(
    type: K,
    buffer: B,
    offset?: number,
    length?: number,
): RealArrayLike<K, B> => {
    const realRaw = buffer;
    const bytes = realBytesMap[type];
    const byteOffset = offset ? offset * bytes : undefined;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const real = createRealTypeMap[type](realRaw, byteOffset, length) as RealTypeMap[K];
    return { real, realRaw, type };
};
