struct Params {
  windowSize: u32,
  windowCount: u32,
  inverse: u32,
};

@group(0) @binding(0) var<storage, read> inputReal: array<f32>;
@group(0) @binding(1) var<storage, read> inputImag: array<f32>;
@group(0) @binding(2) var<storage, read_write> outputReal: array<f32>;
@group(0) @binding(3) var<storage, read_write> outputImag: array<f32>;
@group(0) @binding(4) var<storage, read> reverseTable: array<u32>;
@group(0) @binding(5) var<storage, read> trigTable: array<f32>;
@group(0) @binding(6) var<uniform> params: Params;

fn getSign() -> f32 {
  return select(-1.0, 1.0, params.inverse == 1u);
}

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id) workgroupId: vec3<u32>,
  @builtin(local_invocation_id) localId: vec3<u32>,
) {
  let currentWindowIndex = workgroupId.x;
  if (currentWindowIndex >= params.windowCount) {
    return;
  }

  let windowSize = params.windowSize;
  let globalOffset = currentWindowIndex * windowSize;
  let threadIndex = localId.x;
  let twiddleSign = getSign();

  for (var index: u32 = threadIndex; index < windowSize; index = index + 64u) {
    let reversedIndex = reverseTable[index];
    outputReal[index + globalOffset] = inputReal[reversedIndex + globalOffset];
    outputImag[index + globalOffset] = inputImag[reversedIndex + globalOffset];
  }

  workgroupBarrier();

  var sectionSize: u32 = 2u;
  while (sectionSize <= windowSize) {
    let halfSize = sectionSize >> 1u;
    let step = windowSize / sectionSize;
    for (var blockStart: u32 = 0u; blockStart < windowSize; blockStart = blockStart + sectionSize) {
      for (var twiddleIndex: u32 = threadIndex; twiddleIndex < halfSize; twiddleIndex = twiddleIndex + 64u) {
        let firstIndex = blockStart + twiddleIndex + globalOffset;
        let secondIndex = firstIndex + halfSize;

        let trigIndex = twiddleIndex * step;
        let twiddleReal = trigTable[2u * trigIndex];
        let twiddleImag = twiddleSign * trigTable[2u * trigIndex + 1u];

        let evenReal = outputReal[firstIndex];
        let evenImag = outputImag[firstIndex];
        let oddReal = outputReal[secondIndex];
        let oddImag = outputImag[secondIndex];

        let productReal = oddReal * twiddleReal - oddImag * twiddleImag;
        let productImag = oddReal * twiddleImag + oddImag * twiddleReal;

        outputReal[firstIndex] = evenReal + productReal;
        outputImag[firstIndex] = evenImag + productImag;
        outputReal[secondIndex] = evenReal - productReal;
        outputImag[secondIndex] = evenImag - productImag;
      }
      workgroupBarrier();
    }
    workgroupBarrier();
    sectionSize = sectionSize << 1u;
  }

  if (params.inverse == 1u) {
    let normalizationFactor = f32(windowSize);
    for (var sampleIndex: u32 = threadIndex; sampleIndex < windowSize; sampleIndex = sampleIndex + 64u) {
      let index = sampleIndex + globalOffset;
      outputReal[index] = outputReal[index] / normalizationFactor;
      outputImag[index] = outputImag[index] / normalizationFactor;
    }
  }
}
