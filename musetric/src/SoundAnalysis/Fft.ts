/* eslint-disable max-len */
import { ComplexArray, createComplexArray, createComplexArrayBy, normComplexArray, zeroWindowFilter, gaussWindowFilter } from '..';

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

export const forwardFft = (input: ComplexArray, output: ComplexArray, windowSize: number) => {
	const { sinTable, cosTable } = createSinAndCosTable(windowSize);
	const arr = createComplexArray(windowSize);
	const reverseTable = createReverseTable(windowSize);

	for (let i = 0; i < windowSize; i++) {
		arr.real[i] = input.real[reverseTable[i]];
		arr.imag[i] = input.imag[reverseTable[i]];
	}

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

	for (let i = 0; i < windowSize; i++) {
		output.real[i] = arr.real[i];
		output.imag[i] = arr.imag[i];
	}
};

export const inverseFft = (input: ComplexArray, output: ComplexArray, windowSize: number) => {
	const { sinTable, cosTable } = createSinAndCosTable(windowSize);
	const arr = createComplexArray(windowSize);
	const reverseTable = createReverseTable(windowSize);

	for (let i = 0; i < windowSize; i++) {
		input.imag[i] *= -1;
	}

	for (let i = 0; i < windowSize; i++) {
		arr.real[i] = input.real[reverseTable[i]];
		arr.imag[i] = input.imag[reverseTable[i]];
	}

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

	for (let i = 0; i < windowSize; i++) {
		output.real[i] = arr.real[i] / windowSize;
		output.imag[i] = arr.imag[i] / windowSize;
	}
};

export const getFftFrequencies = (input: Float32Array, output: Float32Array[], windowSize: number): void => {
	const wave = createComplexArrayBy(input, zeroWindowFilter(input.length));
	const window = createComplexArray(windowSize);
	const frequency = createComplexArray(windowSize);
	const filter = gaussWindowFilter(windowSize);

	const count = Math.floor(input.length / windowSize);
	for (let i = 0; i < count; i++) {
		const offset = i * windowSize;
		for (let j = 0; j < windowSize; j++) {
			window.real[j] = wave.real[j + offset] * filter[j];
			window.imag[j] = wave.imag[j + offset] * filter[j];
		}
		forwardFft(window, frequency, windowSize);
		normComplexArray(frequency, output[i], windowSize / 2, 1 / windowSize);
	}
};
