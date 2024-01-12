/* eslint-disable @typescript-eslint/consistent-type-assertions */

const vertexShaderCode = `
@vertex
fn main(@builtin(vertex_index) index : u32) -> @builtin(position) vec4<f32> {
    var pos = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0), // bottom left
        vec2<f32>(1.0, -1.0), // bottom right
        vec2<f32>(-1.0, 1.0), // top left
        vec2<f32>(-1.0, 1.0), // top left
        vec2<f32>(1.0, -1.0), // bottom right
        vec2<f32>(1.0, 1.0) // top right
    );
    return vec4<f32>(pos[index], 0.0, 1.0);
}
`;

const fragmentShaderCode = `
@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> viewportSize: vec2<f32>;

@fragment
fn main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
    let coord = fragCoord.xy / viewportSize.xy;
    let texColor = textureSample(myTexture, mySampler, vec2<f32>(coord.x, 1.0 - coord.y));
    return texColor;
}
`;

type WebGpuInstance = {
    render: (commandEncoder: GPUCommandEncoder) => void,
};
export const createSpectrogramRender = (
    device: GPUDevice,
    context: GPUCanvasContext,
    canvas: HTMLCanvasElement,
    textureView: GPUTextureView,
    textureFormat: GPUTextureFormat,
): WebGpuInstance => {
    const sizeArray = new Float32Array([canvas.width, canvas.height]);
    const viewportSizeBuffer = device.createBuffer({
        label: 'viewportSizeBuffer',
        size: sizeArray.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const sampler = device.createSampler({
        label: 'fragmentShaderSampler',
        magFilter: 'linear',
        minFilter: 'linear',
        mipmapFilter: 'linear',
        maxAnisotropy: 2,
    });

    const pipeline = device.createRenderPipeline({
        label: 'fragmentPipeline',
        layout: device.createPipelineLayout({
            label: 'fragmentPipelineLayout',
            bindGroupLayouts: [
                device.createBindGroupLayout({
                    label: 'fragmentBindGroupLayout',
                    entries: [
                        {
                            binding: 0,
                            visibility: GPUShaderStage.FRAGMENT,
                            sampler: {
                                type: 'filtering',
                            },
                        },
                        {
                            binding: 1,
                            visibility: GPUShaderStage.FRAGMENT,
                            texture: {
                                sampleType: 'float',
                                viewDimension: '2d',
                                multisampled: false,
                            },
                        },
                        {
                            binding: 2,
                            visibility: GPUShaderStage.FRAGMENT,
                            buffer: { type: 'uniform' },
                        },
                    ],
                }),
            ],
        }),
        vertex: {
            module: device.createShaderModule({
                label: 'vertexShaderCode',
                code: vertexShaderCode,
            }),
            entryPoint: 'main',
        },
        fragment: {
            module: device.createShaderModule({
                label: 'fragmentShaderCode',
                code: fragmentShaderCode,
            }),
            entryPoint: 'main',
            targets: [{
                format: textureFormat,
            }],
        },
        primitive: {
            topology: 'triangle-list',
        },
    });

    const bindGroup = device.createBindGroup({
        label: 'fragmentBindGroup',
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: sampler,
            },
            {
                binding: 1,
                resource: textureView,
            },
            {
                binding: 2,
                resource: { buffer: viewportSizeBuffer },
            },
        ],
    });

    const getCanvasTextureView = (): GPUTextureView => context.getCurrentTexture().createView({
        label: 'canvasTextureView',
    });

    const colorAttachment: GPURenderPassColorAttachment = {
        view: getCanvasTextureView(),
        clearValue: { r: 0, g: 0, b: 0, a: 1 },
        loadOp: 'clear',
        storeOp: 'store',
    };
    const beginDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [colorAttachment],
    };

    const result: WebGpuInstance = {
        render: (commandEncoder: GPUCommandEncoder): void => {
            colorAttachment.view = getCanvasTextureView();
            device.queue.writeBuffer(viewportSizeBuffer, 0, sizeArray);

            const renderPassEncoder = commandEncoder.beginRenderPass(beginDescriptor);
            renderPassEncoder.setPipeline(pipeline);
            renderPassEncoder.setBindGroup(0, bindGroup);
            renderPassEncoder.draw(6);
            renderPassEncoder.end();
        },
    };
    return result;
};
