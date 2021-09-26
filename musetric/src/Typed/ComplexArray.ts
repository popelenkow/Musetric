import { RealType, RealTypeMap, createRealTypeMap, realBytesMap } from './RealType';

export type ComplexArray<K extends RealType = RealType> = {
	readonly real: RealTypeMap[K];
	readonly imag: RealTypeMap[K];
	readonly realRaw: ArrayBuffer;
	readonly imagRaw: ArrayBuffer;
	readonly byteOffset: number;
	readonly length: number;
	readonly type: K;
};
export type ComplexArrayMap = {
	float32: ComplexArray<'float32'>;
	float64: ComplexArray<'float64'>;
	uint32: ComplexArray<'uint32'>;
	uint8: ComplexArray<'uint8'>;
};
export const createComplexArray = <K extends RealType>(
	type: K,
	length: number,
): ComplexArray<K> => {
	const bytes = realBytesMap[type];
	const byteOffset = 0;
	const realRaw = new ArrayBuffer(bytes * length);
	const real = createRealTypeMap[type](realRaw, 0, length) as RealTypeMap[K];
	const imagRaw = new ArrayBuffer(bytes * length);
	const imag = createRealTypeMap[type](imagRaw, 0, length) as RealTypeMap[K];
	return {
		real,
		realRaw,
		imag,
		imagRaw,
		byteOffset,
		length,
		type,
	};
};
