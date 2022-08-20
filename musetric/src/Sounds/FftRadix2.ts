import { ComplexArray, createComplexArray } from '../TypedArray/ComplexArray';
import { ComplexIndexable } from '../TypedArray/ComplexIndexable';
import { RealArray, createRealArray } from '../TypedArray/RealArray';
import { RealType } from '../TypedArray/RealType';
import { SpectrometerBase, createSpectrometer, Spectrometer } from './Spectrometer';

/* Licensed by MIT. Based on https://github.com/corbanbrook/dsp.js/tree/c6144fcd75b65f72eac4791ab9f7268a814f44a8 */

type Table<K extends RealType = RealType> = {
	cos: RealArray<K>,
	sin: RealArray<K>,
};
const createTable = <K extends RealType>(type: K, length: number): Table<K> => {
	const cos = createRealArray(type, length);
	const sin = createRealArray(type, length);
	for (let i = 0; i < length; i++) {
		cos.real[i] = Math.cos(-Math.PI / i);
		sin.real[i] = Math.sin(-Math.PI / i);
	}
	return { cos, sin };
};

const createReverseTable = (size: number): Uint32Array => {
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

const transform = (
	arr: ComplexArray,
	windowSize: number,
	table: Table,
): void => {
	let halfSize = 1;
	while (halfSize < windowSize) {
		const cos = table.cos.real[halfSize];
		const sin = table.sin.real[halfSize];

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

export const createFftRadix2Base = (windowSize: number): SpectrometerBase => {
	const arr = createComplexArray('float64', windowSize);
	const reverseTable = createReverseTable(windowSize);
	const table = createTable('float64', windowSize);

	const api: SpectrometerBase = {
		forward: (input: ComplexIndexable, output: ComplexIndexable) => {
			for (let i = 0; i < windowSize; i++) {
				arr.real[i] = input.real[reverseTable[i]];
				arr.imag[i] = input.imag[reverseTable[i]];
			}
			transform(arr, windowSize, table);
			for (let i = 0; i < windowSize; i++) {
				output.real[i] = arr.real[i];
				output.imag[i] = arr.imag[i];
			}
		},
		inverse: (input: ComplexIndexable, output: ComplexIndexable) => {
			for (let i = 0; i < windowSize; i++) {
				arr.real[i] = input.real[reverseTable[i]];
				arr.imag[i] = -input.imag[reverseTable[i]];
			}
			transform(arr, windowSize, table);
			for (let i = 0; i < windowSize; i++) {
				output.real[i] = arr.real[i] / windowSize;
				output.imag[i] = -arr.imag[i] / windowSize;
			}
		},
	};
	return api;
};

export const createFftRadix2 = (windowSize: number): Spectrometer => {
	const base = createFftRadix2Base(windowSize);
	const api: Spectrometer = createSpectrometer(windowSize, base);
	return api;
};
