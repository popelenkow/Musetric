struct SliceWaveParams {
  windowSize : u32,
  paddedWindowSize : u32,
  windowCount : u32,
  visibleSamples : u32,
  step : f32,
};

@group(0) @binding(0) var<storage, read> wave : array<f32>;
@group(0) @binding(1) var<storage, read_write> signal : array<f32>;
@group(0) @binding(2) var<uniform> params : SliceWaveParams;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
  let sampleIndex = gid.x;
  let windowIndex = gid.y;
  if (sampleIndex >= params.paddedWindowSize || windowIndex >= params.windowCount) {
    return;
  }

  var value : f32 = 0.0;
  if (sampleIndex < params.windowSize) {
    let srcIndex = u32(f32(windowIndex) * params.step) + sampleIndex;
    if (srcIndex < params.visibleSamples) {
      value = wave[srcIndex];
    }
  }
  signal[windowIndex * params.paddedWindowSize + sampleIndex] = value;
}
