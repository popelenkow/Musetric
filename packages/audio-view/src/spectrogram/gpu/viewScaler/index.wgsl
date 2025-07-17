struct ViewScalerParamsShader {
  halfSize: u32,
  width: u32,
  height: u32,
  minBin: u32,
  maxBin: u32,
  logMin: f32,
  logRange: f32,
};

@group(0) @binding(0) var<storage, read> magnitudes: array<f32>;
@group(0) @binding(1) var columnTexture: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(2) var<uniform> params: ViewScalerParamsShader;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
  let x = gid.x;
  let y = gid.y;
  if (x >= params.width || y >= params.height) {
    return;
  }
  let ratio = 1.0 - f32(y) / f32(params.height - 1u);
  let raw = exp(params.logMin + params.logRange * ratio);
  var idx = u32(floor(raw) - 1.0);
  if (idx < params.minBin) {
    idx = params.minBin;
  }
  if (idx >= params.maxBin) {
    idx = params.maxBin - 1u;
  }
  let offset = x * params.halfSize + idx;
  let intensity = magnitudes[offset];
  textureStore(columnTexture, vec2u(x, y), vec4f(intensity, 0.0, 0.0, 1.0));
}
