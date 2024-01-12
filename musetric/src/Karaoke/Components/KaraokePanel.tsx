import React, { useEffect, useRef } from 'react';
import { SFC } from '../../UtilityTypes/React';
import { skipPromise } from '../../Utils/SkipPromise';
import { createWebGpu } from './run';

const main = async (canvas: HTMLCanvasElement): Promise<void> => {
    if (!navigator.gpu) throw new Error('WebGPU not supported on this browser.');

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error('need a browser that supports WebGPU');

    const device = await adapter.requestDevice({
        requiredFeatures: ['timestamp-query'],
    });
    if (!device) throw new Error('need a browser that supports WebGPU');

    const canvasRect = canvas.getBoundingClientRect();

    canvas.width = Math.min(
        canvasRect.width,
        device.limits.maxTextureDimension2D,
    );
    canvas.height = Math.min(
        canvasRect.height,
        device.limits.maxTextureDimension2D,
    );

    const context = canvas.getContext('webgpu');
    if (!context) throw new Error('need a browser that supports WebGPU');

    const inst = createWebGpu(device, context, canvas);
    const f = (): void => {
        const g = async (): Promise<void> => {
            await inst.render();
            requestAnimationFrame(f);
        };
        skipPromise(g());
    };
    f();
};

export const KaraokePanel: SFC = () => {
    const ref = useRef<HTMLCanvasElement>(null);
    const refInstance = useRef(false);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        if (refInstance.current) return;
        refInstance.current = true;
        skipPromise(main(canvas));
    }, []);

    return (
        <canvas style={{ width: '100%', height: '100%' }} ref={ref} />
    );
};
