struct MagnitudeNormalizerParams {
  windowSize: u32,
  windowCount: u32,
};

@group(0) @binding(0) var<storage, read_write> signalReal: array<f32>;
@group(0) @binding(1) var<storage, read> signalImag: array<f32>;
@group(0) @binding(2) var<uniform> params: MagnitudeNormalizerParams;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let sampleIndex = gid.x;
  let windowIndex = gid.y;
  let halfSize = params.windowSize / 2u;
  if (sampleIndex >= halfSize || windowIndex >= params.windowCount) {
    return;
  }
  let offset = windowIndex * params.windowSize + sampleIndex;
  let real = signalReal[offset];
  let imag = signalImag[offset];
  let magnitude = sqrt(real * real + imag * imag);
  signalReal[offset] = magnitude;
}
