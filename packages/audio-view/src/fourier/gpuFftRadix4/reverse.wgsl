struct GpuFftRadix4ShaderParams {
  windowSize : u32,
  windowCount : u32,
  reverseWidth : u32,
};

@group(0) @binding(0) var<storage, read_write> dataReal  : array<f32>;
@group(0) @binding(1) var<storage, read>  reverseTable : array<u32>;
@group(0) @binding(2) var<uniform> params : GpuFftRadix4ShaderParams;

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

  for (var start : u32 = threadIndex; start < params.windowSize; start += 64u) {
    var j = indexMap(start, step, len);
    var k = j;
    while (k > start) {
      k = indexMap(k, step, len);
    }
    if (k == start) {
      var valueReal = dataReal[windowOffset + start];
      j = indexMap(start, step, len);
      while (j != start) {
        let tmpReal = dataReal[windowOffset + j];
        dataReal[windowOffset + j] = valueReal;
        valueReal = tmpReal;
        j = indexMap(j, step, len);
      }
      dataReal[windowOffset + start] = valueReal;
    }
  }
}
