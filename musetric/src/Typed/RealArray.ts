import { RealType, RealTypeMap, realBytesMap, createRealTypeMap } from './RealType';

export type RealArrayLike<
	K extends RealType = RealType,
	B extends ArrayBufferLike = ArrayBufferLike,
> = {
	readonly real: RealTypeMap[K];
	readonly realRaw: B;
	readonly byteOffset: number;
	readonly length: number;
	readonly type: K;
};
export type RealArray<K extends RealType = RealType> = RealArrayLike<K, ArrayBuffer>;
export type RealArrayMap = {
	float32: RealArray<'float32'>;
	float64: RealArray<'float64'>;
	uint32: RealArray<'uint32'>;
	uint8: RealArray<'uint8'>;
};
export const createRealArray = <K extends RealType>(
	type: K,
	length: number,
): RealArray<K> => {
	const bytes = realBytesMap[type];
	const byteOffset = 0;
	const realRaw = new ArrayBuffer(bytes * length);
	const real = createRealTypeMap[type](realRaw, 0, length) as RealTypeMap[K];
	return { real, realRaw, byteOffset, length, type };
};

export type SharedRealArray<K extends RealType = RealType> =
	RealArrayLike<K, SharedArrayBuffer>;
export const createSharedRealArray = <K extends RealType>(
	type: K,
	length: number,
): SharedRealArray<K> => {
	const bytes = realBytesMap[type];
	const byteOffset = 0;
	const realRaw = new SharedArrayBuffer(bytes * length);
	const real = createRealTypeMap[type](realRaw) as RealTypeMap[K];
	return { real, realRaw, byteOffset, length, type };
};

export const viewRealArray = <K extends RealType, B extends ArrayBufferLike>(
	realArray: RealArrayLike<K, B>,
	offset: number,
	length: number,
): RealArrayLike<K, B> => {
	const { type } = realArray;
	const bytes = realBytesMap[type];
	const byteOffset = offset * bytes + realArray.byteOffset;
	const { realRaw } = realArray;
	const real = createRealTypeMap[type](realRaw, byteOffset, length) as RealTypeMap[K];
	return { real, realRaw, byteOffset, length, type };
};

export const viewRealArrayFromBuffer = <K extends RealType, B extends ArrayBufferLike>(
	type: K,
	buffer: B,
	byteOffset?: number,
	length?: number,
): RealArrayLike<K, B> => {
	byteOffset = byteOffset || 0;
	const real = createRealTypeMap[type](buffer, byteOffset, length) as RealTypeMap[K];
	length = real.length;
	const realRaw = buffer;
	return { real, realRaw, byteOffset, length, type };
};
