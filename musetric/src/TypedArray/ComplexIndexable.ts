import { createComplexArray, ComplexArrayMap } from './ComplexArray';
import { createComplexList, ComplexListMap } from './ComplexList';
import { RealIndexableType } from './RealType';

export type ComplexIndexableMap = ComplexArrayMap & ComplexListMap;
export type ComplexIndexable<K extends RealIndexableType = RealIndexableType> =
	ComplexIndexableMap[K];
export const createComplexIndexable = <K extends RealIndexableType>(
	type: K,
	length: number,
): ComplexIndexable<K> => {
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (type === 'list') return createComplexList(length) as ComplexIndexable<K>;
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	return createComplexArray(type, length) as ComplexIndexable<K>;
};
