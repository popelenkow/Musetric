export type ComplexArray = {
	real: Float32Array;
	imag: Float32Array;
};

export const createComplexArray = (size: number): ComplexArray => ({
	real: new Float32Array(size),
	imag: new Float32Array(size),
});

export const normComplexArray = (
	input: ComplexArray, output: Float32Array, factor: number,
) => {
	const size = output.length;
	for (let i = 0; i < size; i++) {
		const real = input.real[i];
		const imag = input.imag[i];
		output[i] = factor * Math.sqrt(real * real + imag * imag);
	}
};
