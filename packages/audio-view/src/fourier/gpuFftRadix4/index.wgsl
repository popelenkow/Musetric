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

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id) workgroupId : vec3<u32>,
  @builtin(local_invocation_id) localId : vec3<u32>,
) {
  let windowIndex = workgroupId.x;
  if (windowIndex >= params.windowCount) {
    return;
  }

  let threadIndex = localId.x;
  let windowOffset = windowIndex * params.windowSize;
  var step = 1u << params.reverseWidth;
  var len = params.windowSize >> params.reverseWidth;
  let sign = select(1.0, -1.0, params.inverse == 1u);

  if (len == 2u) {
    for (var outOff : u32 = threadIndex * 2u; outOff < params.windowSize; outOff += 2u * 64u) {
      let t = outOff / 2u;
      let off = windowOffset + reverseTable[t];
      let evenR = inputReal[off];
      let evenI = inputImag[off];
      let oddR = inputReal[off + step];
      let oddI = inputImag[off + step];
      outputReal[windowOffset + outOff] = evenR + oddR;
      outputImag[windowOffset + outOff] = evenI + oddI;
      outputReal[windowOffset + outOff + 1u] = evenR - oddR;
      outputImag[windowOffset + outOff + 1u] = evenI - oddI;
    }
  } else {
    for (var outOff : u32 = threadIndex * 4u; outOff < params.windowSize; outOff += 4u * 64u) {
      let t = outOff / 4u;
      let off = windowOffset + reverseTable[t];
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

      outputReal[windowOffset + outOff] = FAr;
      outputImag[windowOffset + outOff] = FAi;
      outputReal[windowOffset + outOff + 1u] = FBr;
      outputImag[windowOffset + outOff + 1u] = FBi;
      outputReal[windowOffset + outOff + 2u] = FCr;
      outputImag[windowOffset + outOff + 2u] = FCi;
      outputReal[windowOffset + outOff + 3u] = FDr;
      outputImag[windowOffset + outOff + 3u] = FDi;
    }
  }
  workgroupBarrier();

  step = step >> 1u;
  while (step >= 2u) {
    len = (params.windowSize / step) << 1u;
    let quarterLen = len >> 2u;
    for (var outOff : u32 = 0u; outOff < params.windowSize; outOff += len) {
      let limit = outOff + quarterLen;
      for (var i : u32 = outOff + threadIndex; i < limit; i = i + 64u) {
        let k = (i - outOff) * step;
        let A = windowOffset + i;
        let B = quarterLen + A;
        let C = quarterLen + B;
        let D = quarterLen + C;

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
      }
      workgroupBarrier();
    }
    step = step >> 2u;
    workgroupBarrier();
  }

  if (params.inverse == 1u) {
    let size = f32(params.windowSize);
    for (var i : u32 = threadIndex; i < params.windowSize; i = i + 64u) {
      outputReal[windowOffset + i] = outputReal[windowOffset + i] / size;
      outputImag[windowOffset + i] = outputImag[windowOffset + i] / size;
    }
  }
}
