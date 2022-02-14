import { RealIndexableType } from './RealType';
import { createRealArray, RealArrayMap } from './RealArray';
import { createRealList, RealListMap } from './RealList';

export type RealIndexableMap = RealArrayMap & RealListMap;
export type RealIndexable<K extends RealIndexableType = RealIndexableType> =
	RealIndexableMap[K];
export const createRealIndexable = <K extends RealIndexableType>(
	type: K,
	length: number,
): RealIndexable<K> => {
	if (type === 'list') return createRealList(length) as RealIndexable<K>;
	return createRealArray(type, length) as RealIndexable<K>;
};