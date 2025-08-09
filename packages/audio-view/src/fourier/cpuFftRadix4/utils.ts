import { ComplexArray } from '../../common';

/* Licensed by MIT. Based on https://github.com/indutny/fft.js/tree/4a18cf88fcdbd4ad5acca6eaea06a0b462047835 */

type SingleTransform2Options = {
  signal: ComplexArray;
  outOff: number;
  off: number;
  step: number;
};
/** radix-2 implementation. Only called for len=4 */
const singleTransform2 = (options: SingleTransform2Options): void => {
  const { signal, outOff, off, step } = options;

  const evenR = signal.real[off];
  const evenI = signal.imag[off];
  const oddR = signal.real[off + step];
  const oddI = signal.imag[off + step];

  const leftR = evenR + oddR;
  const leftI = evenI + oddI;
  const rightR = evenR - oddR;
  const rightI = evenI - oddI;

  signal.real[outOff] = leftR;
  signal.imag[outOff] = leftI;
  signal.real[outOff + 1] = rightR;
  signal.imag[outOff + 1] = rightI;
};

type SingleTransform4Options = {
  signal: ComplexArray;
  inverse: boolean;
  outOff: number;
  off: number;
  step: number;
};
/** radix-4. Only called for len=8 */
const singleTransform4 = (options: SingleTransform4Options): void => {
  const { signal, inverse, outOff, off, step } = options;
  const sign = inverse ? -1 : 1;
  const step2 = step * 2;
  const step3 = step * 3;

  // Original values
  const Ar = signal.real[off];
  const Ai = signal.imag[off];
  const Br = signal.real[off + step];
  const Bi = signal.imag[off + step];
  const Cr = signal.real[off + step2];
  const Ci = signal.imag[off + step2];
  const Dr = signal.real[off + step3];
  const Di = signal.imag[off + step3];

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

  signal.real[outOff] = FAr;
  signal.imag[outOff] = FAi;
  signal.real[outOff + 1] = FBr;
  signal.imag[outOff + 1] = FBi;
  signal.real[outOff + 2] = FCr;
  signal.imag[outOff + 2] = FCi;
  signal.real[outOff + 3] = FDr;
  signal.imag[outOff + 3] = FDi;
};

export type Transform4Options = {
  signal: ComplexArray;
  inverse: boolean;
  windowSize: number;
  reverseWidth: number;
  reverseTable: Uint32Array<ArrayBuffer>;
  trigTable: Float32Array<ArrayBuffer>;
};
/** radix-4 implementation */
export const transform4 = (options: Transform4Options): void => {
  const { signal, inverse, windowSize, reverseWidth, reverseTable, trigTable } =
    options;

  // Initial step (permute and transform)
  let step = 1 << reverseWidth;
  let len = windowSize >>> reverseWidth;

  const indexMap = (index: number): number => {
    const r = Math.floor(index / step);
    const t = index % step;
    return reverseTable[t] * len + r;
  };

  for (let start = 0; start < windowSize; start++) {
    let j = indexMap(start);
    let k = j;
    while (k > start) {
      k = indexMap(k);
    }
    if (k === start) {
      let valueR = signal.real[start];
      let valueI = signal.imag[start];
      j = indexMap(start);
      while (j !== start) {
        const tmpR = signal.real[j];
        const tmpI = signal.imag[j];
        signal.real[j] = valueR;
        signal.imag[j] = valueI;
        valueR = tmpR;
        valueI = tmpI;
        j = indexMap(j);
      }
      signal.real[start] = valueR;
      signal.imag[start] = valueI;
    }
  }

  let outOff: number = 0;
  if (len === 2) {
    for (outOff = 0; outOff < windowSize; outOff += 2) {
      singleTransform2({ signal, outOff, off: outOff, step: 1 });
    }
  } else {
    // len === 4
    for (outOff = 0; outOff < windowSize; outOff += 4) {
      singleTransform4({ signal, inverse, outOff, off: outOff, step: 1 });
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
        const Ar = signal.real[A];
        const Ai = signal.imag[A];
        const Br = signal.real[B];
        const Bi = signal.imag[B];
        const Cr = signal.real[C];
        const Ci = signal.imag[C];
        const Dr = signal.real[D];
        const Di = signal.imag[D];

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

        signal.real[A] = FAr;
        signal.imag[A] = FAi;
        signal.real[B] = FBr;
        signal.imag[B] = FBi;
        signal.real[C] = FCr;
        signal.imag[C] = FCi;
        signal.real[D] = FDr;
        signal.imag[D] = FDi;
      }
    }
  }
};
