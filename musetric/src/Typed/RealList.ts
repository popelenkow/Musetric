import { RealListType } from './RealType';

export type RealList = {
	readonly real: number[];
	readonly type: RealListType;
};
export type RealListMap = {
	list: RealList;
};
export const createRealList = (length: number): RealList => {
	const real = new Array(length);
	for (let i = 0; i < length; i++) {
		real[i] = 0;
	}
	const type = 'list';
	return { real, type };
};
