struct Params {
  windowSize: u32,
  windowCount: u32,
  inverse: u32,
};

@group(0) @binding(0) var<storage, read_write> dataReal: array<f32>;
@group(0) @binding(1) var<storage, read_write> dataImag: array<f32>;
@group(0) @binding(2) var<storage, read> trigTable: array<f32>;
@group(0) @binding(3) var<uniform> params: Params;

fn getSign() -> f32 {
  return select(-1.0, 1.0, params.inverse == 1u);
}

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
  let twiddleSign = getSign();

  var sectionSize: u32 = 2u;
  while (sectionSize <= windowSize) {
    let halfSize = sectionSize >> 1u;
    let step = windowSize / sectionSize;
    for (var blockStart: u32 = 0u; blockStart < windowSize; blockStart = blockStart + sectionSize) {
      for (var twiddleIndex: u32 = threadIndex; twiddleIndex < halfSize; twiddleIndex = twiddleIndex + 64u) {
        let firstIndex = windowOffset + blockStart + twiddleIndex;
        let secondIndex = firstIndex + halfSize;

        let trigIndex = twiddleIndex * step;
        let twiddleReal = trigTable[2u * trigIndex];
        let twiddleImag = twiddleSign * trigTable[2u * trigIndex + 1u];

        let evenReal = dataReal[firstIndex];
        let evenImag = dataImag[firstIndex];
        let oddReal = dataReal[secondIndex];
        let oddImag = dataImag[secondIndex];

        let productReal = oddReal * twiddleReal - oddImag * twiddleImag;
        let productImag = oddReal * twiddleImag + oddImag * twiddleReal;

        dataReal[firstIndex] = evenReal + productReal;
        dataImag[firstIndex] = evenImag + productImag;
        dataReal[secondIndex] = evenReal - productReal;
        dataImag[secondIndex] = evenImag - productImag;
      }
      workgroupBarrier();
    }
    workgroupBarrier();
    sectionSize = sectionSize << 1u;
  }

  if (params.inverse == 1u) {
    let normalizationFactor = f32(windowSize);
    for (var sampleIndex: u32 = threadIndex; sampleIndex < windowSize; sampleIndex = sampleIndex + 64u) {
      let index = windowOffset + sampleIndex;
      dataReal[index] = dataReal[index] / normalizationFactor;
      dataImag[index] = dataImag[index] / normalizationFactor;
    }
  }
}
