import { ComplexArray } from '../complexArray';

/* Licensed by MIT. Based on https://github.com/indutny/fft.js/tree/4a18cf88fcdbd4ad5acca6eaea06a0b462047835 */

type SingleTransform2Options = {
  input: ComplexArray;
  output: ComplexArray;
  outOff: number;
  off: number;
  step: number;
};
/** radix-2 implementation. Only called for len=4 */
const singleTransform2 = (options: SingleTransform2Options): void => {
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
  inverse: boolean;
  outOff: number;
  off: number;
  step: number;
};
/** radix-4. Only called for len=8 */
const singleTransform4 = (options: SingleTransform4Options): void => {
  const { input, output, inverse, outOff, off, step } = options;
  const sign = inverse ? -1 : 1;
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

export type Transform4Options = {
  input: ComplexArray;
  output: ComplexArray;
  inverse: boolean;
  windowSize: number;
  reverseWidth: number;
  reverseTable: Uint32Array;
  trigTable: Float32Array;
};
/** radix-4 implementation */
export const transform4 = (options: Transform4Options): void => {
  const {
    input,
    output,
    inverse,
    windowSize,
    reverseWidth,
    reverseTable,
    trigTable,
  } = options;

  // Initial step (permute and transform)
  let step = 1 << reverseWidth;
  let len = windowSize >>> reverseWidth;

  let outOff: number;
  let t: number;
  if (len === 2) {
    for (outOff = 0, t = 0; outOff < windowSize; outOff += 2, t++) {
      const off = reverseTable[t];
      singleTransform2({ input, output, outOff, off, step });
    }
  } else {
    // len === 4
    for (outOff = 0, t = 0; outOff < windowSize; outOff += 4, t++) {
      const off = reverseTable[t];
      singleTransform4({ input, output, inverse, outOff, off, step });
    }
  }

  // Loop through steps in decreasing order
  const sign = inverse ? -1 : 1;
  for (step >>= 1; step >= 2; step >>= 2) {
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

        const tableBr = trigTable[k];
        const tableBi = sign * trigTable[k + 1];
        const MBr = Br * tableBr - Bi * tableBi;
        const MBi = Br * tableBi + Bi * tableBr;

        const tableCr = trigTable[2 * k];
        const tableCi = sign * trigTable[2 * k + 1];
        const MCr = Cr * tableCr - Ci * tableCi;
        const MCi = Cr * tableCi + Ci * tableCr;

        const tableDr = trigTable[3 * k];
        const tableDi = sign * trigTable[3 * k + 1];
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
