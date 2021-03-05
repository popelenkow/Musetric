/* eslint-disable max-len */
import { ComplexArray, createComplexArray, createComplexArrayBy, normComplexArray, zeroWindowFilter, gaussWindowFilter } from '..';

const evalDft = (input: ComplexArray, output: ComplexArray, windowSize: number, isInverse: boolean) => {
	for (let i = 0; i < windowSize; i++) {
		output.real[i] = 0;
		output.imag[i] = 0;
	}

	const pi2 = isInverse ? Math.PI * 2 : Math.PI * (-2);
	const invWindowSize = 1 / windowSize;
	for (let k = 0; k < windowSize; k++) {
		for (let i = 0; i < windowSize; i++) {
			const theta = pi2 * k * i * invWindowSize;
			const cos = Math.cos(theta);
			const sin = Math.sin(theta);
			const real = input.real[i];
			const imag = input.imag[i];
			output.real[k] += real * cos - imag * sin;
			output.imag[k] += real * sin + imag * cos;
		}
	}

	if (isInverse) {
		for (let i = 0; i < windowSize; i++) {
			output.real[i] *= invWindowSize;
			output.imag[i] *= invWindowSize;
		}
	}
};

export const createDft = (windowSize: number) => {
	const window = createComplexArray(windowSize);
	const frequency = createComplexArray(windowSize);
	const filter = gaussWindowFilter(windowSize);

	const result = {
		forward: (input: ComplexArray, output: ComplexArray) => {
			evalDft(input, output, windowSize, false);
		},
		inverse: (input: ComplexArray, output: ComplexArray) => {
			evalDft(input, output, windowSize, true);
		},
		getFrequencies: (input: Float32Array, output: Float32Array[]) => {
			const wave = createComplexArrayBy(input, zeroWindowFilter(input.length));
			const count = Math.floor(input.length / windowSize);
			for (let i = 0; i < count; i++) {
				const offset = i * windowSize;
				for (let j = 0; j < windowSize; j++) {
					window.real[j] = wave.real[j + offset] * filter[j];
					window.imag[j] = wave.imag[j + offset] * filter[j];
				}
				result.forward(window, frequency);
				normComplexArray(frequency, output[i], windowSize / 2, 1 / windowSize);
			}
		},
	};
	return result;
};
