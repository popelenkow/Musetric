import { OverloadedConstructorParameters } from '../Typescript/OverloadedConstructorParameters';

export type RealTypeMap = {
	float32: Float32Array;
	float64: Float64Array;
	uint32: Uint32Array;
	uint8: Uint8Array;
};
export type RealType = keyof RealTypeMap;
export const realBytesMap: Record<RealType, number> = {
	float32: Float32Array.BYTES_PER_ELEMENT,
	float64: Float64Array.BYTES_PER_ELEMENT,
	uint32: Uint32Array.BYTES_PER_ELEMENT,
	uint8: Uint8Array.BYTES_PER_ELEMENT,
};

const castArgs = (args: unknown[]): [] => args as [];
type RealArrayConstructorArgs = OverloadedConstructorParameters<Float32ArrayConstructor>;
type RealArrayConstructor = (...args: RealArrayConstructorArgs) => unknown;
export const createRealTypeMap: Record<RealType, RealArrayConstructor> = {
	float32: (...args) => new Float32Array(...castArgs(args)),
	float64: (...args) => new Float64Array(...castArgs(args)),
	uint32: (...args) => new Uint32Array(...castArgs(args)),
	uint8: (...args) => new Uint8Array(...castArgs(args)),
};

export type RealListTypeMap = {
	list: number[];
};
export type RealListType = keyof RealListTypeMap;

export type RealIndexableTypeMap = RealTypeMap & RealListTypeMap;
export type RealIndexableType = RealType | RealListType;
