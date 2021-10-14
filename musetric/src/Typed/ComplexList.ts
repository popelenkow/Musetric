import { RealListType } from './RealType';

export type ComplexListMap = {
	list: ComplexList;
};
export type ComplexList = {
	readonly real: number[];
	readonly imag: number[];
	readonly type: RealListType;
};

export const createComplexList = (length: number): ComplexList => {
	const real = new Array(length);
	for (let i = 0; i < length; i++) {
		real[i] = 0;
	}
	const imag = new Array(length);
	for (let i = 0; i < length; i++) {
		imag[i] = 0;
	}
	const type = 'list';
	return { real, imag, type };
};
