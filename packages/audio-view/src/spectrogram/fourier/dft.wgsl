struct Params {
  windowSize : u32,
};

@group(0) @binding(0) var<storage, read>  inputReal  : array<f32>;
@group(0) @binding(1) var<storage, read>  inputImag  : array<f32>;
@group(0) @binding(2) var<storage, read_write> outputReal : array<f32>;
@group(0) @binding(3) var<storage, read_write> outputImag : array<f32>;
@group(0) @binding(4) var<uniform> params : Params;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
  let k = gid.x;
  if (k >= params.windowSize) {
    return;
  }
  var real : f32 = 0.0;
  var imag : f32 = 0.0;
  for (var n: u32 = 0u; n < params.windowSize; n = n + 1u) {
    let angle = 2.0 * 3.141592653589793 * f32(k * n) / f32(params.windowSize);
    let re = inputReal[n];
    let im = inputImag[n];
    real = real + re * cos(angle) + im * sin(angle);
    imag = imag - re * sin(angle) + im * cos(angle);
  }
  outputReal[k] = real;
  outputImag[k] = imag;
}
