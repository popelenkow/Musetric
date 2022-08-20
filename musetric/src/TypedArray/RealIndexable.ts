import { createRealArray, RealArrayMap } from './RealArray';
import { createRealList, RealListMap } from './RealList';
import { RealIndexableType } from './RealType';

export type RealIndexableMap = RealArrayMap & RealListMap;
export type RealIndexable<K extends RealIndexableType = RealIndexableType> =
	RealIndexableMap[K];
export const createRealIndexable = <K extends RealIndexableType>(
	type: K,
	length: number,
): RealIndexable<K> => {
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (type === 'list') return createRealList(length) as RealIndexable<K>;
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	return createRealArray(type, length) as RealIndexable<K>;
};
