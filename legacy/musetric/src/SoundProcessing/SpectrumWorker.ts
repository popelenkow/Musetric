import { createTimer } from '../Rendering/Timer';
import { createFftRadix4 } from '../Sounds/FftRadix4';
import { Spectrometer } from '../Sounds/Spectrometer';
import { viewRealArray, RealArray, createSharedRealArray, createRealArray } from '../TypedArray/RealArray';
import { viewRealArrays } from '../TypedArray/RealArrays';
import { runPromiseWorker } from '../Workers/PromiseWorker';

const flags = {
    invalid: 0,
    pre: 1,
    ok: 2,
} as const;
type Flag = typeof flags[keyof typeof flags];

export type SpectrumOptions = {
    windowSize: number,
    count: number,
};
export type SpectrumBufferEvent =
    | { type: 'newBuffer', buffer: SharedArrayBuffer }
    | { type: 'invalidate', from: number, to: number }
    | { type: 'shift', offset: number };
export type SpectrumWorker = {
    setup: (options: SpectrumOptions) => SharedArrayBuffer,
    start: () => void,
    stop: () => void,
    emitBufferEvent: (event: SpectrumBufferEvent) => void,
};
export const createSpectrumWorker = (): SpectrumWorker => {
    type SpectrumState = SpectrumOptions & {
        spectrometer: Spectrometer,
        raw: RealArray<'uint8'>,
        outputs: RealArray<'uint8'>[],
        outputStats: Flag[],
        draw: () => void,
    };
    let state: SpectrumState | undefined;
    const setup = (options: SpectrumOptions): SharedArrayBuffer => {
        const { windowSize, count } = options;
        const fftSize = windowSize / 2;
        const spectrometer = createFftRadix4(windowSize);
        const result = createSharedRealArray('uint8', count * fftSize);
        const raw = createRealArray('uint8', count * fftSize);
        const outputs = viewRealArrays('uint8', raw.realRaw, {
            offset: 0,
            step: fftSize,
            length: fftSize,
            count,
        });
        const outputStats = Array<Flag>(count).fill(flags.invalid);
        const draw = (): void => result.real.set(raw.real);
        state = { windowSize, count, raw, spectrometer, outputs, outputStats, draw };
        return result.realRaw;
    };

    let accOffset = 0;
    const shift = (offset: number): void => {
        if (!state) return;
        const { raw, windowSize, outputStats, count } = state;
        const fftSize = windowSize / 2;
        accOffset += offset;
        let floorOffset = Math.floor(accOffset);
        if (floorOffset < 0) floorOffset += 1;
        if (floorOffset !== 0) {
            accOffset -= floorOffset;
            if (floorOffset < 0) {
                floorOffset *= -1;
                raw.real.copyWithin(0, fftSize * floorOffset, fftSize * count);
                for (let i = 0; i < count - floorOffset; i++) {
                    outputStats[i] = outputStats[i + floorOffset];
                }
                for (let i = count - floorOffset; i < count; i++) {
                    outputStats[i] = flags.invalid;
                }
            }
            else {
                raw.real.copyWithin(fftSize * floorOffset, 0, fftSize * (count - floorOffset));
                for (let i = count - 1; i >= floorOffset; i--) {
                    outputStats[i] = outputStats[i - floorOffset];
                }
                for (let i = floorOffset - 1; i >= 0; i--) {
                    outputStats[i] = flags.invalid;
                }
            }
        }
    };

    const invalidate = (rawFrom: number, rawTo: number): void => {
        if (!state) return;
        const from = Math.floor(rawFrom);
        const to = Math.floor(rawTo);
        const { outputStats } = state;
        for (let i = from; i < to; i++) {
            outputStats[i] = flags.invalid;
        }
    };

    let buffer: RealArray<'float32'> | undefined;
    let inputs: RealArray<'float32'>[] | undefined;
    const setBuffer = (value: SharedArrayBuffer): void => {
        if (!state) return;
        const { windowSize, count } = state;
        buffer = viewRealArray('float32', value);
        const step = (buffer.real.length - windowSize) / (count - 1);
        inputs = viewRealArrays(buffer.type, buffer.realRaw, {
            offset: 0,
            step,
            length: windowSize,
            count,
        });
        invalidate(0, count);
        accOffset = 0;
    };

    const emitBufferEvent = (event: SpectrumBufferEvent): void => {
        if (!state) return;
        const { count } = state;
        const toRenderPoint = (value: number, length: number): number => {
            return count * (value / length);
        };
        if (event.type === 'newBuffer') setBuffer(event.buffer);
        if (event.type === 'invalidate') {
            if (!buffer) return;
            const from = toRenderPoint(event.from, buffer.real.length);
            const to = toRenderPoint(event.to, buffer.real.length);
            invalidate(from, to);
        }
        if (event.type === 'shift') {
            if (!buffer) return;
            const offset = toRenderPoint(event.offset, buffer.real.length);
            shift(offset);
        }
    };

    let index = 0;
    let pause = true;
    const onIteration = (): void => {
        if (!state || !inputs || pause) return;
        const { draw, count, spectrometer, outputs, outputStats } = state;
        const { timeIsUp } = createTimer(10);
        let i = index;
        let isDirty = false;
        while (i < count && !timeIsUp()) {
            if (outputStats[i] !== flags.ok) {
                isDirty = true;
                spectrometer.byteFrequency(inputs[i], outputs[i], {});
                outputStats[i] += 1;
            }
            i++;
        }
        if (isDirty) draw();
        index = i % count;
    };

    const loop = (): void => {
        onIteration();
        setTimeout(loop, 16);
    };
    loop();

    const start = (): void => {
        pause = false;
    };
    const stop = (): void => {
        pause = true;
    };

    return {
        setup,
        start,
        stop,
        emitBufferEvent,
    };
};

export const runSpectrumWorker = (worker: Worker): void => {
    runPromiseWorker(worker, createSpectrumWorker);
};
