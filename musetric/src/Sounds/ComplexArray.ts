type M = {
	float32: Float32Array;
	float64: Float64Array;
	uint32: Uint32Array;
	uint8: Uint8Array;
	list: Array<number>;
};

export type RealArrayType = 'float32' | 'float64' | 'uint32' | 'uint8' | 'list';
export type RealBufferType = 'float32' | 'float64' | 'uint32' | 'uint8';

export type RealArray<K extends RealArrayType = RealArrayType> = M[K];
export const createRealArray = <K extends keyof M>(size: number, type: K): RealArray<K> => {
	if (type === 'float32') return new Float32Array(size) as M[K];
	if (type === 'float64') return new Float64Array(size) as M[K];
	if (type === 'uint32') return new Uint32Array(size) as M[K];
	if (type === 'uint8') return new Uint8Array(size) as M[K];
	if (type === 'list') {
		const arr = new Array<number>(size);
		for (let i = 0; i < size; i++) arr[i] = 0;
		return arr as M[K];
	}
	throw new Error();
};
export const viewRealArray = <Arr extends RealArray<RealBufferType>>(
	arr: Arr,
	offset: number,
	length: number,
): Arr => {
	if (arr instanceof Float32Array) {
		const byteOffset = offset * Float32Array.BYTES_PER_ELEMENT + arr.byteOffset;
		return new Float32Array(arr.buffer, byteOffset, length) as Arr;
	}
	if (arr instanceof Float64Array) {
		const byteOffset = offset * Float64Array.BYTES_PER_ELEMENT + arr.byteOffset;
		return new Float64Array(arr.buffer, byteOffset, length) as Arr;
	}
	if (arr instanceof Uint32Array) {
		const byteOffset = offset * Uint32Array.BYTES_PER_ELEMENT + arr.byteOffset;
		return new Uint32Array(arr.buffer, byteOffset, length) as Arr;
	}
	if (arr instanceof Uint8Array) {
		const byteOffset = offset * Uint8Array.BYTES_PER_ELEMENT + arr.byteOffset;
		return new Uint8Array(arr.buffer, byteOffset, length) as Arr;
	}
	throw new Error();
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
): void => {
	const size = output.length;
	for (let i = 0; i < size; i++) {
		const real = input.real[i];
		const imag = input.imag[i];
		output[i] = factor * Math.sqrt(real * real + imag * imag);
	}
};
