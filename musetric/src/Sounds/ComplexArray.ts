type M = {
	float32: Float32Array;
	float64: Float64Array;
	list: Array<number>;
};

export type RealArrayType = 'float32' | 'float64' | 'list';
export type RealArray<K extends RealArrayType = RealArrayType> = M[K];
export const createRealArray = <K extends keyof M>(size: number, type: K): RealArray<K> => {
	if (type === 'float32') return new Float32Array(size) as M[K];
	if (type === 'float64') return new Float64Array(size) as M[K];
	const arr = new Array<number>(size);
	for (let i = 0; i < size; i++) arr[i] = 0;
	return arr as M[K];
};

export type ComplexArray<K extends RealArrayType = RealArrayType> = {
	real: M[K];
	imag: M[K];
};
export const createComplexArray = <K extends keyof M>(size: number, type: K): ComplexArray<K> => {
	return {
		real: createRealArray(size, type),
		imag: createRealArray(size, type),
	};
};

export const normComplexArray = (
	input: ComplexArray, output: RealArray, factor: number,
) => {
	const size = output.length;
	for (let i = 0; i < size; i++) {
		const real = input.real[i];
		const imag = input.imag[i];
		output[i] = factor * Math.sqrt(real * real + imag * imag);
	}
};
