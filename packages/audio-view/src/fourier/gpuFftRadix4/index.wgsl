struct Params {
  windowSize : u32,
  windowCount : u32,
  reverseWidth : u32,
  inverse : u32,
};

@group(0) @binding(0) var<storage, read>  inputReal  : array<f32>;
@group(0) @binding(1) var<storage, read>  inputImag  : array<f32>;
@group(0) @binding(2) var<storage, read_write> outputReal : array<f32>;
@group(0) @binding(3) var<storage, read_write> outputImag : array<f32>;
@group(0) @binding(4) var<storage, read>  reverseTable : array<u32>;
@group(0) @binding(5) var<storage, read>  trigTable : array<f32>;
@group(0) @binding(6) var<uniform> params : Params;

@compute @workgroup_size(1)
fn main(@builtin(workgroup_id) workgroup_id : vec3<u32>) {
  let windowOffset = workgroup_id.x * params.windowSize;
  var step = 1u << params.reverseWidth;
  var len = params.windowSize >> params.reverseWidth;
  var outOff : u32 = 0u;
  var t : u32 = 0u;
  let sign = select(1.0, -1.0, params.inverse == 1u);

  if (len == 2u) {
    for (; outOff < params.windowSize; outOff += 2u) {
      let off = reverseTable[t] + windowOffset;
      t = t + 1u;
      let evenR = inputReal[off];
      let evenI = inputImag[off];
      let oddR = inputReal[off + step];
      let oddI = inputImag[off + step];
      outputReal[outOff + windowOffset] = evenR + oddR;
      outputImag[outOff + windowOffset] = evenI + oddI;
      outputReal[outOff + windowOffset + 1u] = evenR - oddR;
      outputImag[outOff + windowOffset + 1u] = evenI - oddI;
    }
  } else {
    for (; outOff < params.windowSize; outOff += 4u) {
      let off = reverseTable[t] + windowOffset;
      t = t + 1u;
      let step2 = step * 2u;
      let step3 = step * 3u;

      let Ar = inputReal[off];
      let Ai = inputImag[off];
      let Br = inputReal[off + step];
      let Bi = inputImag[off + step];
      let Cr = inputReal[off + step2];
      let Ci = inputImag[off + step2];
      let Dr = inputReal[off + step3];
      let Di = inputImag[off + step3];

      let T0r = Ar + Cr;
      let T0i = Ai + Ci;
      let T1r = Ar - Cr;
      let T1i = Ai - Ci;
      let T2r = Br + Dr;
      let T2i = Bi + Di;
      let T3r = sign * (Br - Dr);
      let T3i = sign * (Bi - Di);

      let FAr = T0r + T2r;
      let FAi = T0i + T2i;
      let FBr = T1r + T3i;
      let FBi = T1i - T3r;
      let FCr = T0r - T2r;
      let FCi = T0i - T2i;
      let FDr = T1r - T3i;
      let FDi = T1i + T3r;

      outputReal[outOff + windowOffset] = FAr;
      outputImag[outOff + windowOffset] = FAi;
      outputReal[outOff + windowOffset + 1u] = FBr;
      outputImag[outOff + windowOffset + 1u] = FBi;
      outputReal[outOff + windowOffset + 2u] = FCr;
      outputImag[outOff + windowOffset + 2u] = FCi;
      outputReal[outOff + windowOffset + 3u] = FDr;
      outputImag[outOff + windowOffset + 3u] = FDi;
    }
  }

  step = step >> 1u;
  while (step >= 2u) {
    len = (params.windowSize / step) << 1u;
    let quarterLen = len >> 2u;
    for (outOff = 0u; outOff < params.windowSize; outOff += len) {
      let limit = outOff + quarterLen;
      var k : u32 = 0u;
      for (var i : u32 = outOff; i < limit; i = i + 1u) {
        let A = i + windowOffset;
        let B = A + quarterLen;
        let C = B + quarterLen;
        let D = C + quarterLen;

        let Ar = outputReal[A];
        let Ai = outputImag[A];
        let Br = outputReal[B];
        let Bi = outputImag[B];
        let Cr = outputReal[C];
        let Ci = outputImag[C];
        let Dr = outputReal[D];
        let Di = outputImag[D];

        let MAr = Ar;
        let MAi = Ai;

        let tableBr = trigTable[k];
        let tableBi = sign * trigTable[k + 1u];
        let MBr = Br * tableBr - Bi * tableBi;
        let MBi = Br * tableBi + Bi * tableBr;

        let tableCr = trigTable[2u * k];
        let tableCi = sign * trigTable[2u * k + 1u];
        let MCr = Cr * tableCr - Ci * tableCi;
        let MCi = Cr * tableCi + Ci * tableCr;

        let tableDr = trigTable[3u * k];
        let tableDi = sign * trigTable[3u * k + 1u];
        let MDr = Dr * tableDr - Di * tableDi;
        let MDi = Dr * tableDi + Di * tableDr;

        let T0r = MAr + MCr;
        let T0i = MAi + MCi;
        let T1r = MAr - MCr;
        let T1i = MAi - MCi;
        let T2r = MBr + MDr;
        let T2i = MBi + MDi;
        let T3r = sign * (MBr - MDr);
        let T3i = sign * (MBi - MDi);

        let FAr = T0r + T2r;
        let FAi = T0i + T2i;
        let FCr = T0r - T2r;
        let FCi = T0i - T2i;
        let FBr = T1r + T3i;
        let FBi = T1i - T3r;
        let FDr = T1r - T3i;
        let FDi = T1i + T3r;

        outputReal[A] = FAr;
        outputImag[A] = FAi;
        outputReal[B] = FBr;
        outputImag[B] = FBi;
        outputReal[C] = FCr;
        outputImag[C] = FCi;
        outputReal[D] = FDr;
        outputImag[D] = FDi;

        k = k + step;
      }
    }
    step = step >> 2u;
  }

  if (params.inverse == 1u) {
    let size = f32(params.windowSize);
    for (var i : u32 = 0u; i < params.windowSize; i = i + 1u) {
      outputReal[i + windowOffset] = outputReal[i + windowOffset] / size;
      outputImag[i + windowOffset] = outputImag[i + windowOffset] / size;
    }
  }
}
