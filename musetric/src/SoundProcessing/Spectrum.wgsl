@group(0) @binding(0) var<storage, read_write> inputBuffer: array<f32>;
@group(0) @binding(1) var<storage, read_write> outputBuffer: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    let idx = global_id.x;
    let N = arrayLength(&inputBuffer);

    var sumReal: f32 = 0.0;
    var sumImag: f32 = 0.0;

    for (var k: u32 = 0u; k < N; k = k + 1u) {
        let angle = -2.0 * 3.14159265359 * f32(idx) * f32(k) / f32(N);
        let cosAngle = cos(angle);
        let sinAngle = sin(angle);

        sumReal += inputBuffer[k] * cosAngle;
        sumImag += inputBuffer[k] * sinAngle;
    }

    // Вычисляем модуль комплексного числа
    outputBuffer[idx] = sqrt(sumReal * sumReal + sumImag * sumImag) / f32(N);
}