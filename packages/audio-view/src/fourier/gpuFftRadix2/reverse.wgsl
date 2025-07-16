struct Params {
  windowSize: u32,
  windowCount: u32,
};

@group(0) @binding(0) var<storage, read_write> dataReal: array<f32>;
@group(0) @binding(1) var<storage, read_write> dataImag: array<f32>;
@group(0) @binding(2) var<storage, read> reverseTable: array<u32>;
@group(0) @binding(3) var<uniform> params: Params;

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id) workgroupId: vec3<u32>,
  @builtin(local_invocation_id) localId: vec3<u32>,
) {
  let windowIndex = workgroupId.x;
  if (windowIndex >= params.windowCount) {
    return;
  }

  let windowSize = params.windowSize;
  let windowOffset = windowIndex * windowSize;
  let threadIndex = localId.x;

  for (var index: u32 = threadIndex; index < windowSize; index = index + 64u) {
    let reversedIndex = reverseTable[index];
    if (reversedIndex > index) {
      let a = windowOffset + index;
      let b = windowOffset + reversedIndex;
      let tempReal = dataReal[a];
      let tempImag = dataImag[a];
      dataReal[a] = dataReal[b];
      dataImag[a] = dataImag[b];
      dataReal[b] = tempReal;
      dataImag[b] = tempImag;
    }
  }
}
