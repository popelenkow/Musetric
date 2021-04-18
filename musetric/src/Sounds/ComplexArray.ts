export type ComplexArray = {
	real: Float32Array;
	imag: Float32Array;
};

export const createComplexArray = (size: number): ComplexArray => ({
	real: new Float32Array(size),
	imag: new Float32Array(size),
});

export const createComplexArrayBy = (real: Float32Array, imag: Float32Array) => ({
	real,
	imag,
});

export const normComplexArray = (
	input: ComplexArray, output: Float32Array, size: number, factor: number,
) => {
	for (let i = 0; i < size; i++) {
		const real = input.real[i];
		const imag = input.imag[i];
		output[i] = factor * Math.sqrt(real * real + imag * imag);
	}
};
