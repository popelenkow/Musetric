struct GpuFftRadix4ParamsShader {
  windowSize : u32,
  windowCount : u32,
  reverseWidth : u32,
};

@group(0) @binding(0) var<storage, read_write> dataReal : array<f32>;
@group(0) @binding(1) var<storage, read_write> dataImag : array<f32>;
@group(0) @binding(2) var<storage, read> trigTable : array<f32>;
@group(0) @binding(3) var<uniform> params : GpuFftRadix4ParamsShader;

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
  step = step >> 1u;
  let sign = 1.0;

  while (step >= 2u) {
    let len = (params.windowSize / step) << 1u;
    let quarterLen = len >> 2u;
    for (var outOff : u32 = 0u; outOff < params.windowSize; outOff += len) {
      let limit = outOff + quarterLen;
      for (var i : u32 = outOff + threadIndex; i < limit; i = i + 64u) {
        let k = (i - outOff) * step;
        let A = windowOffset + i;
        let B = quarterLen + A;
        let C = quarterLen + B;
        let D = quarterLen + C;

        let Ar = dataReal[A];
        let Ai = dataImag[A];
        let Br = dataReal[B];
        let Bi = dataImag[B];
        let Cr = dataReal[C];
        let Ci = dataImag[C];
        let Dr = dataReal[D];
        let Di = dataImag[D];

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

        dataReal[A] = FAr;
        dataImag[A] = FAi;
        dataReal[B] = FBr;
        dataImag[B] = FBi;
        dataReal[C] = FCr;
        dataImag[C] = FCi;
        dataReal[D] = FDr;
        dataImag[D] = FDi;
      }
      workgroupBarrier();
    }
    step = step >> 2u;
    workgroupBarrier();
  }


}
