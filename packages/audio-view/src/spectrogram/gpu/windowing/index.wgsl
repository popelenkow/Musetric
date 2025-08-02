struct WindowingParams {
  windowSize: u32,
  paddedWindowSize: u32,
  windowCount: u32,
};

@group(0) @binding(0) var<storage, read_write> signal: array<f32>;
@group(0) @binding(1) var<uniform> params: WindowingParams;
@group(0) @binding(2) var<storage, read> windowFunction: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let sampleIndex = gid.x;
  let windowIndex = gid.y;
  if (sampleIndex >= params.windowSize || windowIndex >= params.windowCount) {
    return;
  }
  let offset = windowIndex * params.paddedWindowSize + sampleIndex;
  let weight = windowFunction[sampleIndex];
  signal[offset] *= weight;
}
