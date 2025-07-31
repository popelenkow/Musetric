struct SliceWavesParams {
  windowSize : u32,
  windowCount : u32,
  visibleSamples : u32,
  step : f32,
};

@group(0) @binding(0) var<storage, read> wave : array<f32>;
@group(0) @binding(1) var<storage, read_write> waves : array<f32>;
@group(0) @binding(2) var<uniform> params : SliceWavesParams;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
  let sampleIndex = gid.x;
  let windowIndex = gid.y;
  if (sampleIndex >= params.windowSize || windowIndex >= params.windowCount) {
    return;
  }

  let srcIndex = u32(f32(windowIndex) * params.step) + sampleIndex;
  var value : f32 = 0.0;
  if (srcIndex < params.visibleSamples) {
    value = wave[srcIndex];
  }
  waves[windowIndex * params.windowSize + sampleIndex] = value;
}
