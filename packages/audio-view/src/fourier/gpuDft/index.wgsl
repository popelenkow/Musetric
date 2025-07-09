struct Params {
  windowSize : u32,
  windowCount : u32,
  inverse : u32,
};

@group(0) @binding(0) var<storage, read>  inputReal  : array<f32>;
@group(0) @binding(1) var<storage, read>  inputImag  : array<f32>;
@group(0) @binding(2) var<storage, read_write> outputReal : array<f32>;
@group(0) @binding(3) var<storage, read_write> outputImag : array<f32>;
@group(0) @binding(4) var<uniform> params : Params;

fn sign() -> f32 {
  if (params.inverse == 1u) {
    return 1.0;
  }
  return -1.0;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
  let k = gid.x;
  let windowIndex = gid.y;
  if (k >= params.windowSize || windowIndex >= params.windowCount) {
    return;
  }
  let windowOffset = windowIndex * params.windowSize;
  var real : f32 = 0.0;
  var imag : f32 = 0.0;
  let s = sign();
  for (var n: u32 = 0u; n < params.windowSize; n = n + 1u) {
    let angle = 2.0 * 3.141592653589793 * f32(k * n) / f32(params.windowSize);
    let re = inputReal[windowOffset + n];
    let im = inputImag[windowOffset + n];
    let c = cos(angle);
    let si = s * sin(angle);
    real = real + re * c - im * si;
    imag = imag + re * si + im * c;
  }
  if (params.inverse == 1u) {
    let size = f32(params.windowSize);
    real = real / size;
    imag = imag / size;
  }
  outputReal[windowOffset + k] = real;
  outputImag[windowOffset + k] = imag;
}
