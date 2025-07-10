struct Params {
  halfSize: u32,
  windowCount: u32,
  minDecibel: f32,
};

@group(0) @binding(0) var<storage, read_write> magnitudes: array<f32>;
@group(0) @binding(1) var<uniform> params: Params;

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let windowIndex = gid.x;
  if (windowIndex >= params.windowCount) {
    return;
  }
  let windowOffset = windowIndex * params.halfSize;
  var maxMagnitude: f32 = 0.0;
  for (var i: u32 = 0u; i < params.halfSize; i = i + 1u) {
    let value = magnitudes[windowOffset + i];
    if (value > maxMagnitude) {
      maxMagnitude = value;
    }
  }
  let inverseMaximum = 1.0 / maxMagnitude;
  let epsilon = 1e-12;
  let decibelFactor = 8.685889f / -params.minDecibel;
  for (var i: u32 = 0u; i < params.halfSize; i = i + 1u) {
    let sampleIndex = windowOffset + i;
    let normalizedMagnitude = magnitudes[sampleIndex] * inverseMaximum + epsilon;
    var decibel = log(normalizedMagnitude) * decibelFactor + 1.0;
    if (decibel > 0.0) {
      magnitudes[sampleIndex] = decibel;
    } else {
      magnitudes[sampleIndex] = 0.0;
    }
  }
}
