struct GpuFftRadix4ShaderParams {
  windowSize : u32,
  windowCount : u32,
  reverseWidth : u32,
};

@group(0) @binding(0) var<storage, read_write> dataReal  : array<f32>;
@group(0) @binding(1) var<storage, read_write> dataImag  : array<f32>;
@group(0) @binding(2) var<storage, read>  reverseTable : array<u32>;
@group(0) @binding(3) var<uniform> params : GpuFftRadix4ShaderParams;

fn indexMap(index : u32, step : u32, len : u32) -> u32 {
  let r = index / step;
  let t = index % step;
  return reverseTable[t] * len + r;
}

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
  let sign = 1.0;

  for (var start : u32 = threadIndex; start < params.windowSize; start += 64u) {
    var j = indexMap(start, step, len);
    var k = j;
    while (k > start) {
      k = indexMap(k, step, len);
    }
    if (k == start) {
      var valueReal = dataReal[windowOffset + start];
      var valueImag = dataImag[windowOffset + start];
      j = indexMap(start, step, len);
      while (j != start) {
        let tmpReal = dataReal[windowOffset + j];
        let tmpImag = dataImag[windowOffset + j];
        dataReal[windowOffset + j] = valueReal;
        dataImag[windowOffset + j] = valueImag;
        valueReal = tmpReal;
        valueImag = tmpImag;
        j = indexMap(j, step, len);
      }
      dataReal[windowOffset + start] = valueReal;
      dataImag[windowOffset + start] = valueImag;
    }
  }
  workgroupBarrier();

  if (len == 2u) {
    for (var outOff : u32 = threadIndex * 2u; outOff < params.windowSize; outOff += 2u * 64u) {
      let evenR = dataReal[windowOffset + outOff];
      let evenI = dataImag[windowOffset + outOff];
      let oddR = dataReal[windowOffset + outOff + 1u];
      let oddI = dataImag[windowOffset + outOff + 1u];
      dataReal[windowOffset + outOff] = evenR + oddR;
      dataImag[windowOffset + outOff] = evenI + oddI;
      dataReal[windowOffset + outOff + 1u] = evenR - oddR;
      dataImag[windowOffset + outOff + 1u] = evenI - oddI;
    }
  } else {
    for (var outOff : u32 = threadIndex * 4u; outOff < params.windowSize; outOff += 4u * 64u) {
      let Ar = dataReal[windowOffset + outOff];
      let Ai = dataImag[windowOffset + outOff];
      let Br = dataReal[windowOffset + outOff + 1u];
      let Bi = dataImag[windowOffset + outOff + 1u];
      let Cr = dataReal[windowOffset + outOff + 2u];
      let Ci = dataImag[windowOffset + outOff + 2u];
      let Dr = dataReal[windowOffset + outOff + 3u];
      let Di = dataImag[windowOffset + outOff + 3u];

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

      dataReal[windowOffset + outOff] = FAr;
      dataImag[windowOffset + outOff] = FAi;
      dataReal[windowOffset + outOff + 1u] = FBr;
      dataImag[windowOffset + outOff + 1u] = FBi;
      dataReal[windowOffset + outOff + 2u] = FCr;
      dataImag[windowOffset + outOff + 2u] = FCi;
      dataReal[windowOffset + outOff + 3u] = FDr;
      dataImag[windowOffset + outOff + 3u] = FDi;
    }
  }
}
