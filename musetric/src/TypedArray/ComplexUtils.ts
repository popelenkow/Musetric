import { RealIndexable } from './RealIndexable';
import { ComplexIndexable } from './ComplexIndexable';

export const normComplexIndexable = (
	input: ComplexIndexable,
	output: RealIndexable,
	factor: number,
): void => {
	const size = output.real.length;
	for (let i = 0; i < size; i++) {
		const real = input.real[i];
		const imag = input.imag[i];
		output.real[i] = factor * Math.sqrt(real * real + imag * imag);
	}
};
