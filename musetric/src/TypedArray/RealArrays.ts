import { RealType, realBytesMap } from './RealType';
import { RealArray, viewRealArray, RealArrayLike } from './RealArray';

export type RealArraysOptions = {
	offset: number;
	step: number;
	count: number;
	length: number;
};

export const createRealArrays = <K extends RealType>(
	type: K,
	commonLength: number,
	options: RealArraysOptions,
): RealArray<K>[] => {
	const { step, count, length } = options;
	const bytes = realBytesMap[type];
	const realRaw = new ArrayBuffer(bytes * commonLength);
	let { offset } = options;
	const arrays: RealArray<K>[] = [];
	for (let i = 0; i < count; i++) {
		const view = viewRealArray(type, realRaw, Math.floor(offset), length);
		arrays.push(view);
		offset += step;
	}
	return arrays;
};

export const viewRealArrays = <K extends RealType, B extends ArrayBufferLike>(
	type: K,
	buffer: B,
	options: RealArraysOptions,
): RealArrayLike<K, B>[] => {
	const { step, count, length } = options;
	const realRaw = buffer;
	let { offset } = options;
	const arrays: RealArrayLike<K, B>[] = [];
	for (let i = 0; i < count; i++) {
		const view = viewRealArray(type, realRaw, Math.floor(offset), length);
		arrays.push(view);
		offset += step;
	}
	return arrays;
};
