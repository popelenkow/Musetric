import { RealType, realBytesMap } from './RealType';
import { RealArray, SharedRealArray, viewRealArray, RealArrayLike } from './RealArray';

export type RealArraysOptions = {
	offset: number;
	step: number;
	count: number;
	size: number;
};

export const createRealArrays = <K extends RealType>(
	type: K,
	length: number,
	options: RealArraysOptions,
): RealArray<K>[] => {
	const { step, count, size } = options;
	const bytes = realBytesMap[type];
	const realRaw = new ArrayBuffer(bytes * length);
	let { offset } = options;
	const arrays: RealArray<K>[] = [];
	for (let i = 0; i < count; i++) {
		const view = viewRealArray(type, realRaw, Math.floor(offset), size);
		arrays.push(view);
		offset += step;
	}
	return arrays;
};

export const createSharedRealArray = <K extends RealType>(
	type: K,
	length: number,
	options: RealArraysOptions,
): SharedRealArray<K>[] => {
	const { step, count, size } = options;
	const bytes = realBytesMap[type];
	const realRaw = new SharedArrayBuffer(bytes * length);
	let { offset } = options;
	const arrays: SharedRealArray<K>[] = [];
	for (let i = 0; i < count; i++) {
		const view = viewRealArray(type, realRaw, Math.floor(offset), size);
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
	const { step, count, size } = options;
	const realRaw = buffer;
	let { offset } = options;
	const arrays: RealArrayLike<K, B>[] = [];
	for (let i = 0; i < count; i++) {
		const view = viewRealArray(type, realRaw, Math.floor(offset), size);
		arrays.push(view);
		offset += step;
	}
	return arrays;
};
