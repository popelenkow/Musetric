import { ComplexArray, createComplexArray, RealArray, RealArrayType, createRealArray } from './ComplexArray';
import { SpectrometerBase, createSpectrometer, Spectrometer } from './Spectrometer';

/** Licensed by MIT. Based on https://github.com/corbanbrook/dsp.js/tree/c6144fcd75b65f72eac4791ab9f7268a814f44a8 */
type Table<K extends RealArrayType = RealArrayType> = {
	cos: RealArray<K>;
	sin: RealArray<K>;
};
const createTable = <K extends RealArrayType>(size: number, type: K): Table<K> => {
	const cos = createRealArray(size, type);
	const sin = createRealArray(size, type);
	for (let i = 0; i < size; i++) {
		cos[i] = Math.cos(-Math.PI / i);
		sin[i] = Math.sin(-Math.PI / i);
	}
	return { cos, sin };
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

const transform = (
	arr: ComplexArray, windowSize: number, table: Table,
) => {
	let halfSize = 1;
	while (halfSize < windowSize) {
		const cos = table.cos[halfSize];
		const sin = table.sin[halfSize];

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
	const arr = createComplexArray(windowSize, 'float64');
	const reverseTable = createReverseTable(windowSize);
	const table = createTable(windowSize, 'float64');

	const api: SpectrometerBase = {
		forward: (input: ComplexArray, output: ComplexArray) => {
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
		inverse: (input: ComplexArray, output: ComplexArray) => {
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
