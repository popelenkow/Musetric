/* eslint-disable no-continue */
import { ComplexArray } from './ComplexArray';
import { SpectrometerBase, Spectrometer, createSpectrometer } from './Spectrometer';

type Arr = Array<number> | Float32Array | Float64Array;

/** Licensed by MIT. Based on https://github.com/indutny/fft.js/tree/4a18cf88fcdbd4ad5acca6eaea06a0b462047835 */
type SingleTransform2Options = {
	outOff: number;
	off: number;
	step: number;
	out: Arr;
	data: Arr;
};
/** radix-2 implementation. Only called for len=4 */
const singleTransform2 = (options: SingleTransform2Options) => {
	const { outOff, off, step, out, data } = options;

	const evenR = data[off];
	const evenI = data[off + 1];
	const oddR = data[off + step];
	const oddI = data[off + step + 1];

	const leftR = evenR + oddR;
	const leftI = evenI + oddI;
	const rightR = evenR - oddR;
	const rightI = evenI - oddI;

	out[outOff] = leftR;
	out[outOff + 1] = leftI;
	out[outOff + 2] = rightR;
	out[outOff + 3] = rightI;
};

type SingleTransform4Options = {
	outOff: number;
	off: number;
	step: number;
	out: Arr;
	data: Arr;
	inv: boolean;
};
/** radix-4. Only called for len=8 */
const singleTransform4 = (options: SingleTransform4Options) => {
	const { outOff, off, step, out, data } = options;
	const inv = options.inv ? -1 : 1;
	const step2 = step * 2;
	const step3 = step * 3;

	// Original values
	const Ar = data[off];
	const Ai = data[off + 1];
	const Br = data[off + step];
	const Bi = data[off + step + 1];
	const Cr = data[off + step2];
	const Ci = data[off + step2 + 1];
	const Dr = data[off + step3];
	const Di = data[off + step3 + 1];

	// Pre-Final values
	const T0r = Ar + Cr;
	const T0i = Ai + Ci;
	const T1r = Ar - Cr;
	const T1i = Ai - Ci;
	const T2r = Br + Dr;
	const T2i = Bi + Di;
	const T3r = inv * (Br - Dr);
	const T3i = inv * (Bi - Di);

	// Final values
	const FAr = T0r + T2r;
	const FAi = T0i + T2i;

	const FBr = T1r + T3i;
	const FBi = T1i - T3r;

	const FCr = T0r - T2r;
	const FCi = T0i - T2i;

	const FDr = T1r - T3i;
	const FDi = T1i + T3r;

	out[outOff] = FAr;
	out[outOff + 1] = FAi;
	out[outOff + 2] = FBr;
	out[outOff + 3] = FBi;
	out[outOff + 4] = FCr;
	out[outOff + 5] = FCi;
	out[outOff + 6] = FDr;
	out[outOff + 7] = FDi;
};

type Transform4Options = {
	out: Arr;
	data: Arr;
	inv: boolean;
	windowSize2: number;
	width: number;
	reverseTable: Arr;
	table: Arr;
};
/** radix-4 implementation */
const transform4 = (options: Transform4Options) => {
	const { out, data, windowSize2, width, reverseTable, table } = options;

	// Initial step (permute and transform)
	let step = 1 << width;
	let len = (windowSize2 / step) << 1;

	let outOff: number;
	let t: number;
	if (len === 4) {
		for (outOff = 0, t = 0; outOff < windowSize2; outOff += len, t++) {
			const off = reverseTable[t];
			singleTransform2({ outOff, off, step, out, data });
		}
	} else {
		// len === 8
		for (outOff = 0, t = 0; outOff < windowSize2; outOff += len, t++) {
			const off = reverseTable[t];
			singleTransform4({ outOff, off, step, out, data, inv: options.inv });
		}
	}

	// Loop through steps in decreasing order
	const inv = options.inv ? -1 : 1;
	for (step >>= 2; step >= 2; step >>= 2) {
		len = (windowSize2 / step) << 1;
		const quarterLen = len >>> 2;
		// Loop through offsets in the data
		for (outOff = 0; outOff < windowSize2; outOff += len) {
			// Full case
			const limit = outOff + quarterLen;
			for (let i = outOff, k = 0; i < limit; i += 2, k += step) {
				const A = i;
				const B = A + quarterLen;
				const C = B + quarterLen;
				const D = C + quarterLen;

				// Original values
				const Ar = out[A];
				const Ai = out[A + 1];
				const Br = out[B];
				const Bi = out[B + 1];
				const Cr = out[C];
				const Ci = out[C + 1];
				const Dr = out[D];
				const Di = out[D + 1];

				// Middle values
				const MAr = Ar;
				const MAi = Ai;

				const tableBr = table[k];
				const tableBi = inv * table[k + 1];
				const MBr = Br * tableBr - Bi * tableBi;
				const MBi = Br * tableBi + Bi * tableBr;

				const tableCr = table[2 * k];
				const tableCi = inv * table[2 * k + 1];
				const MCr = Cr * tableCr - Ci * tableCi;
				const MCi = Cr * tableCi + Ci * tableCr;

				const tableDr = table[3 * k];
				const tableDi = inv * table[3 * k + 1];
				const MDr = Dr * tableDr - Di * tableDi;
				const MDi = Dr * tableDi + Di * tableDr;

				// Pre-Final values
				const T0r = MAr + MCr;
				const T0i = MAi + MCi;
				const T1r = MAr - MCr;
				const T1i = MAi - MCi;
				const T2r = MBr + MDr;
				const T2i = MBi + MDi;
				const T3r = inv * (MBr - MDr);
				const T3i = inv * (MBi - MDi);

				// Final values
				const FAr = T0r + T2r;
				const FAi = T0i + T2i;

				const FCr = T0r - T2r;
				const FCi = T0i - T2i;

				const FBr = T1r + T3i;
				const FBi = T1i - T3r;

				const FDr = T1r - T3i;
				const FDi = T1i + T3r;

				out[A] = FAr;
				out[A + 1] = FAi;
				out[B] = FBr;
				out[B + 1] = FBi;
				out[C] = FCr;
				out[C + 1] = FCi;
				out[D] = FDr;
				out[D + 1] = FDi;
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
		toComplexArray: (input: Arr) => {
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
		fromArray: (input: Arr, storage: ComplexArray) => {
			for (let i = 0; i < windowSize * 2; i += 2) {
				storage.real[i >>> 1] = input[i];
				storage.imag[i >>> 1] = input[i + 1];
			}
		},
	};
	return api;
};

const createReverseTable = (width: number) => {
	const reverseTable = new Array<number>(1 << width);
	for (let j = 0; j < reverseTable.length; j++) {
		reverseTable[j] = 0;
		for (let shift = 0; shift < width; shift += 2) {
			const revShift = width - shift - 2;
			reverseTable[j] |= ((j >>> shift) & 3) << revShift;
		}
	}
	return reverseTable;
};

const createTable = (windowSize: number) => {
	const table = new Array(2 * windowSize);
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

	const windowSize2 = windowSize * 2;

	const table = createTable(windowSize);

	const width = getWidth(windowSize);

	// Pre-compute bit-reversal patterns
	const reverseTable = createReverseTable(width);

	const converter = createArrayRadix4(windowSize);
	const api: SpectrometerBase & { transform: (data: Arr, out: Arr) => void } = {
		transform: (data: Arr, out: Arr) => {
			transform4({
				out,
				data,
				inv: false,
				windowSize2,
				width,
				reverseTable,
				table,
			});
		},
		forward: (input: ComplexArray, output: ComplexArray) => {
			const req = converter.toArray(input);
			const res = converter.createComplexArray();
			transform4({
				out: res,
				data: req,
				inv: false,
				windowSize2,
				width,
				reverseTable,
				table,
			});
			converter.fromArray(res, output);
		},
		inverse: (input: ComplexArray, output: ComplexArray) => {
			const req = converter.toArray(input);
			const res = converter.createComplexArray();
			transform4({
				out: res,
				data: req,
				inv: true,
				windowSize2,
				width,
				reverseTable,
				table,
			});
			for (let i = 0; i < res.length; i++) {
				res[i] /= windowSize;
			}
			converter.fromArray(res, output);
		},
	};
	return api;
};

export const createFftRadix4 = (windowSize: number) => {
	const base = createFftRadix4Base(windowSize);
	const api: Spectrometer = createSpectrometer(windowSize, base);
	return api;
};
