import { RealType, RealTypeMap, createRealTypeMap, realBytesMap } from './RealType';

export type ComplexArray<K extends RealType = RealType> = {
    readonly type: K,
    readonly real: RealTypeMap[K],
    readonly realRaw: ArrayBuffer,
    readonly imag: RealTypeMap[K],
    readonly imagRaw: ArrayBuffer,
};

export const createComplexArray = <K extends RealType>(
    type: K,
    length: number,
): ComplexArray<K> => {
    const bytes = realBytesMap[type];
    const realRaw = new ArrayBuffer(bytes * length);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const real = createRealTypeMap[type](realRaw, 0, length) as RealTypeMap[K];
    const imagRaw = new ArrayBuffer(bytes * length);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const imag = createRealTypeMap[type](imagRaw, 0, length) as RealTypeMap[K];
    return {
        real,
        realRaw,
        imag,
        imagRaw,
        type,
    };
};

export type ComplexArrayMap = {
    float32: ComplexArray<'float32'>,
    float64: ComplexArray<'float64'>,
    uint32: ComplexArray<'uint32'>,
    uint8: ComplexArray<'uint8'>,
};
