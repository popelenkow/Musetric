import { RealIndexableType } from './RealType';
import { createComplexArray, ComplexArrayMap } from './ComplexArray';
import { createComplexList, ComplexListMap } from './ComplexList';

export type ComplexIndexableMap = ComplexArrayMap & ComplexListMap;
export type ComplexIndexable<K extends RealIndexableType = RealIndexableType> =
	ComplexIndexableMap[K];
export const createComplexIndexable = <K extends RealIndexableType>(
	type: K,
	length: number,
): ComplexIndexable<K> => {
	if (type === 'list') return createComplexList(length) as ComplexIndexable<K>;
	return createComplexArray(type, length) as ComplexIndexable<K>;
};
