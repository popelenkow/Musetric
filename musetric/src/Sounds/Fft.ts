import { ComplexArray, createComplexArray, normComplexArray } from './ComplexArray';
import { gaussWindowFilter } from './WindowFilters';

/** Based on https://github.com/corbanbrook/dsp.js */

const createSinAndCosTable = (size: number) => {
	const sinTable = new Float32Array(size);
	const cosTable = new Float32Array(size);
	for (let i = 0; i < size; i++) {
		sinTable[i] = Math.sin(-Math.PI / i);
		cosTable[i] = Math.cos(-Math.PI / i);
	}
	return { sinTable, cosTable };
};

const createReverseTable = (size: number) => {
	const reverseTable = new Uint32Array(size);

	let limit = 1;
	let bit = size >> 1;

	while (limit < size) {
		for (let i = 0; i < limit; i++) {
			reverseTable[i + limit] = reverseTable[i] + bit;
		}

		limit <<= 1;
		bit >>= 1;
	}
	return reverseTable;
};

const evalFft = (
	arr: ComplexArray, windowSize: number, sinTable: Float32Array, cosTable: Float32Array,
) => {
	let halfSize = 1;
	while (halfSize < windowSize) {
		const cos = cosTable[halfSize];
		const sin = sinTable[halfSize];

		let real = 1;
		let imag = 0;

		for (let i = 0; i < halfSize; i++) {
			let j = i;

			while (j < windowSize) {
				const shift = j + halfSize;
				const tr = real * arr.real[shift] - imag * arr.imag[shift];
				const ti = real * arr.imag[shift] + imag * arr.real[shift];

				arr.real[shift] = arr.real[j] - tr;
				arr.imag[shift] = arr.imag[j] - ti;
				arr.real[j] += tr;
				arr.imag[j] += ti;

				j += halfSize << 1;
			}

			const curReal = real;
			const curImag = imag;
			real = curReal * cos - curImag * sin;
			imag = curReal * sin + curImag * cos;
		}

		halfSize <<= 1;
	}
};

export type FftFrequencyOptions = {
	offset: number;
};

export type FftFrequenciesOptions = {
	offset: number;
	step: number;
	count: number;
};

export const createFft = (windowSize: number) => {
	const window = createComplexArray(windowSize);
	const frequency = createComplexArray(windowSize);
	const filter = gaussWindowFilter(windowSize);
	const arr = createComplexArray(windowSize);
	const reverseTable = createReverseTable(windowSize);
	const { sinTable, cosTable } = createSinAndCosTable(windowSize);

	const result = {
		forward: (input: ComplexArray, output: ComplexArray) => {
			for (let i = 0; i < windowSize; i++) {
				arr.real[i] = input.real[reverseTable[i]];
				arr.imag[i] = input.imag[reverseTable[i]];
			}
			evalFft(arr, windowSize, sinTable, cosTable);
			for (let i = 0; i < windowSize; i++) {
				output.real[i] = arr.real[i];
				output.imag[i] = arr.imag[i];
			}
		},
		inverse: (input: ComplexArray, output: ComplexArray) => {
			for (let i = 0; i < windowSize; i++) {
				arr.real[i] = input.real[reverseTable[i]];
				arr.imag[i] = input.imag[reverseTable[i]] * -1;
			}
			evalFft(arr, windowSize, sinTable, cosTable);
			for (let i = 0; i < windowSize; i++) {
				output.real[i] = arr.real[i] / windowSize;
				output.imag[i] = arr.imag[i] / windowSize;
			}
		},
		frequency: (input: Float32Array, output: Float32Array, options: FftFrequencyOptions) => {
			const offset = Math.floor(options.offset);
			for (let i = 0; i < windowSize; i++) {
				window.real[i] = input[i + offset] * filter[i];
				window.imag[i] = 0;
			}
			result.forward(window, frequency);
			normComplexArray(frequency, output, windowSize / 2, 1 / windowSize);
		},
		frequencies: (input: Float32Array, output: Float32Array[], options: FftFrequenciesOptions) => {
			const { step, count } = options;
			let { offset } = options;
			for (let i = 0; i < count; i++) {
				result.frequency(input, output[i], { offset });
				offset += step;
			}
		},
	};
	return result;
};
export type Fft = ReturnType<typeof createFft>;

/** Pseudo conversion. Rendering only */
export const mapAmplitudeToBel = (spectrum: Float32Array[]) => {
	for (let i = 0; i < spectrum.length; i++) {
		for (let j = 0; j < spectrum[i].length; j++) {
			const amplitude = spectrum[i][j];
			const value = Math.log10(amplitude) / 5;
			const bel = Math.max(0, Math.min(1, value + 1));
			spectrum[i][j] = bel;
		}
	}
};
