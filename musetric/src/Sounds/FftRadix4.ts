/* eslint-disable no-continue */
import { RealArray, ComplexArray, createRealArray } from './ComplexArray';
import { SpectrometerBase, Spectrometer, createSpectrometer } from './Spectrometer';

/** Licensed by MIT. Based on https://github.com/indutny/fft.js/tree/4a18cf88fcdbd4ad5acca6eaea06a0b462047835 */
type SingleTransform2Options = {
	input: ComplexArray;
	output: ComplexArray;
	outOff: number;
	off: number;
	step: number;
};
/** radix-2 implementation. Only called for len=4 */
const singleTransform2 = (options: SingleTransform2Options) => {
	const { input, output, outOff, off, step } = options;

	const evenR = input.real[off];
	const evenI = input.imag[off];
	const oddR = input.real[off + step];
	const oddI = input.imag[off + step];

	const leftR = evenR + oddR;
	const leftI = evenI + oddI;
	const rightR = evenR - oddR;
	const rightI = evenI - oddI;

	output.real[outOff] = leftR;
	output.imag[outOff] = leftI;
	output.real[outOff + 1] = rightR;
	output.imag[outOff + 1] = rightI;
};

type SingleTransform4Options = {
	input: ComplexArray;
	output: ComplexArray;
	inv: boolean;
	outOff: number;
	off: number;
	step: number;
};
/** radix-4. Only called for len=8 */
const singleTransform4 = (options: SingleTransform4Options) => {
	const { input, output, inv, outOff, off, step } = options;
	const sign = inv ? -1 : 1;
	const step2 = step * 2;
	const step3 = step * 3;

	// Original values
	const Ar = input.real[off];
	const Ai = input.imag[off];
	const Br = input.real[off + step];
	const Bi = input.imag[off + step];
	const Cr = input.real[off + step2];
	const Ci = input.imag[off + step2];
	const Dr = input.real[off + step3];
	const Di = input.imag[off + step3];

	// Pre-Final values
	const T0r = Ar + Cr;
	const T0i = Ai + Ci;
	const T1r = Ar - Cr;
	const T1i = Ai - Ci;
	const T2r = Br + Dr;
	const T2i = Bi + Di;
	const T3r = sign * (Br - Dr);
	const T3i = sign * (Bi - Di);

	// Final values
	const FAr = T0r + T2r;
	const FAi = T0i + T2i;

	const FBr = T1r + T3i;
	const FBi = T1i - T3r;

	const FCr = T0r - T2r;
	const FCi = T0i - T2i;

	const FDr = T1r - T3i;
	const FDi = T1i + T3r;

	output.real[outOff] = FAr;
	output.imag[outOff] = FAi;
	output.real[outOff + 1] = FBr;
	output.imag[outOff + 1] = FBi;
	output.real[outOff + 2] = FCr;
	output.imag[outOff + 2] = FCi;
	output.real[outOff + 3] = FDr;
	output.imag[outOff + 3] = FDi;
};

type Transform4Options = {
	input: ComplexArray;
	output: ComplexArray;
	inv: boolean;
	windowSize: number;
	width: number;
	reverseTable: RealArray;
	table: RealArray;
};
/** radix-4 implementation */
const transform4 = (options: Transform4Options) => {
	const { input, output, inv, windowSize, width, reverseTable, table } = options;

	// Initial step (permute and transform)
	let step = 1 << width;
	let len = (windowSize / step) << 1;

	let outOff: number;
	let t: number;
	if (len === 2) {
		for (outOff = 0, t = 0; outOff < windowSize; outOff += len, t++) {
			const off = reverseTable[t];
			singleTransform2({ input, output, outOff, off, step: step >> 1 });
		}
	} else {
		// len === 8
		for (outOff = 0, t = 0; outOff < windowSize; outOff += len, t++) {
			const off = reverseTable[t];
			singleTransform4({ input, output, inv, outOff, off, step: step >> 1 });
		}
	}

	// Loop through steps in decreasing order
	const sign = inv ? -1 : 1;
	for (step >>= 2; step >= 2; step >>= 2) {
		len = (windowSize / step) << 1;
		const quarterLen = len >>> 2;
		// Loop through offsets in the data
		for (outOff = 0; outOff < windowSize; outOff += len) {
			// Full case
			const limit = outOff + quarterLen;
			for (let i = outOff, k = 0; i < limit; i++, k += step) {
				const A = i;
				const B = A + quarterLen;
				const C = B + quarterLen;
				const D = C + quarterLen;

				// Original values
				const Ar = output.real[A];
				const Ai = output.imag[A];
				const Br = output.real[B];
				const Bi = output.imag[B];
				const Cr = output.real[C];
				const Ci = output.imag[C];
				const Dr = output.real[D];
				const Di = output.imag[D];

				// Middle values
				const MAr = Ar;
				const MAi = Ai;

				const tableBr = table[k];
				const tableBi = sign * table[k + 1];
				const MBr = Br * tableBr - Bi * tableBi;
				const MBi = Br * tableBi + Bi * tableBr;

				const tableCr = table[2 * k];
				const tableCi = sign * table[2 * k + 1];
				const MCr = Cr * tableCr - Ci * tableCi;
				const MCi = Cr * tableCi + Ci * tableCr;

				const tableDr = table[3 * k];
				const tableDi = sign * table[3 * k + 1];
				const MDr = Dr * tableDr - Di * tableDi;
				const MDi = Dr * tableDi + Di * tableDr;

				// Pre-Final values
				const T0r = MAr + MCr;
				const T0i = MAi + MCi;
				const T1r = MAr - MCr;
				const T1i = MAi - MCi;
				const T2r = MBr + MDr;
				const T2i = MBi + MDi;
				const T3r = sign * (MBr - MDr);
				const T3i = sign * (MBi - MDi);

				// Final values
				const FAr = T0r + T2r;
				const FAi = T0i + T2i;

				const FCr = T0r - T2r;
				const FCi = T0i - T2i;

				const FBr = T1r + T3i;
				const FBi = T1i - T3r;

				const FDr = T1r - T3i;
				const FDi = T1i + T3r;

				output.real[A] = FAr;
				output.imag[A] = FAi;
				output.real[B] = FBr;
				output.imag[B] = FBi;
				output.real[C] = FCr;
				output.imag[C] = FCi;
				output.real[D] = FDr;
				output.imag[D] = FDi;
			}
		}
	}
};

export const createArrayRadix4 = (windowSize: number) => {
	const api = {
		createComplexArray: () => {
			const res = new Array<number>(windowSize * 2);
			for (let i = 0; i < windowSize * 2; i++) {
				res[i] = 0;
			}
			return res;
		},
		toComplexArray: (input: RealArray) => {
			const res = api.createComplexArray();
			for (let i = 0; i < windowSize * 2; i += 2) {
				res[i] = input[i >>> 1];
				res[i + 1] = 0;
			}
			return res;
		},
		toArray: (input: ComplexArray) => {
			const res = api.createComplexArray();
			for (let i = 0; i < windowSize * 2; i += 2) {
				res[i] = input.real[i >>> 1];
				res[i + 1] = input.imag[i >>> 1];
			}
			return res;
		},
		fromArray: (input: RealArray, storage: ComplexArray) => {
			for (let i = 0; i < windowSize * 2; i += 2) {
				storage.real[i >>> 1] = input[i];
				storage.imag[i >>> 1] = input[i + 1];
			}
		},
	};
	return api;
};

const createReverseTable = (width: number) => {
	const reverseTable = new Array<number>(1 << (width - 1));
	for (let j = 0; j < reverseTable.length; j++) {
		reverseTable[j] = 0;
		for (let shift = 0; shift < width; shift += 2) {
			const revShift = width - shift - 2;
			reverseTable[j] |= ((j >>> shift) & 3) << revShift;
		}
		reverseTable[j] /= 2;
	}
	return reverseTable;
};

const createTable = (windowSize: number) => {
	const table = createRealArray(2 * windowSize, 'list');
	for (let i = 0; i < table.length; i += 2) {
		const angle = (Math.PI * i) / windowSize;
		table[i] = Math.cos(angle);
		table[i + 1] = -Math.sin(angle);
	}
	return table;
};

const getWidth = (windowSize: number) => {
	// Find size's power of two
	let power = 0;
	for (let t = 1; windowSize > t; t <<= 1) {
		power++;
	}

	// Calculate initial step's width:
	//   * If we are full radix-4 - it is 2x smaller to give initial len=8
	//   * Otherwise it is the same as `power` to give len=4
	const width = power % 2 === 0 ? power - 1 : power;
	return width;
};

export const createFftRadix4Base = (windowSize: number) => {
	if (windowSize <= 1 || (windowSize & (windowSize - 1)) !== 0) {
		throw new Error('FFT size must be a power of two and bigger than 1');
	}

	const table = createTable(windowSize);

	const width = getWidth(windowSize);

	// Pre-compute bit-reversal patterns
	const reverseTable = createReverseTable(width);

	const api: SpectrometerBase = {
		forward: (input: ComplexArray, output: ComplexArray) => {
			transform4({
				input,
				output,
				inv: false,
				windowSize,
				width,
				reverseTable,
				table,
			});
		},
		inverse: (input: ComplexArray, output: ComplexArray) => {
			transform4({
				input,
				output,
				inv: true,
				windowSize,
				width,
				reverseTable,
				table,
			});
			for (let i = 0; i < windowSize; i++) {
				output.real[i] /= windowSize;
				output.imag[i] /= windowSize;
			}
		},
	};
	return api;
};

export const createFftRadix4 = (windowSize: number) => {
	const base = createFftRadix4Base(windowSize);
	const api: Spectrometer = createSpectrometer(windowSize, base);
	return api;
};
