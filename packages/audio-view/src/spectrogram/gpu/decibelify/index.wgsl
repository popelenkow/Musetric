struct DecibelifyParams {
  halfSize: u32,
  windowCount: u32,
  minDecibel: f32,
};

@group(0) @binding(0) var<storage, read_write> signal: array<f32>;
@group(0) @binding(1) var<uniform> params: DecibelifyParams;

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let halfSize = params.halfSize;
  let windowCount = params.windowCount;
  let minDecibel = params.minDecibel;
  
  let windowIndex = gid.x;
  if (windowIndex >= windowCount) {
    return;
  }
  let windowOffset = halfSize * windowIndex;
  var maxMagnitude: f32 = 0.0;
  for (var i: u32 = 0u; i < halfSize; i += 1u) {
    let value = signal[windowOffset + i];
    if (value > maxMagnitude) {
      maxMagnitude = value;
    }
  }
  let inverseMaximum = 1.0 / maxMagnitude;
  let epsilon = 1e-12;
  let decibelFactor = 8.685889f / -minDecibel;
  for (var i: u32 = 0u; i < halfSize; i += 1u) {
    let sampleIndex = windowOffset + i;
    let normalizedMagnitude = signal[sampleIndex] * inverseMaximum + epsilon;
    var decibel = log(normalizedMagnitude) * decibelFactor + 1.0;
    if (decibel < 0.0) {
      decibel = 0.0;
    }
    signal[sampleIndex] = decibel;
  }
}
