import { ComplexArray, createComplexArray } from './ComplexArray';
import { SpectrometerBase, createSpectrometer, Spectrometer } from './Spectrometer';

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

export const createFftBase = (windowSize: number) => {
	const arr = createComplexArray(windowSize);
	const reverseTable = createReverseTable(windowSize);
	const { sinTable, cosTable } = createSinAndCosTable(windowSize);

	const api: SpectrometerBase = {
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
	};
	return api;
};

export const createFft = (windowSize: number) => {
	const base = createFftBase(windowSize);
	const api: Spectrometer = createSpectrometer(windowSize, base);
	return api;
};
