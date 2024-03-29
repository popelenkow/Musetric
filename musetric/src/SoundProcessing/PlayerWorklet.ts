import { viewRealArray, RealArray } from '../TypedArray/RealArray';
import { runPromiseAudioWorklet, PromiseAudioWorkletOptions, PromiseAudioWorkletOnProcess } from '../Workers/PromiseAudioWorklet';

export type PlayerOptions = {
    soundBuffer: SharedArrayBuffer,
    cursor: number,
};
export type PlayerWorklet = {
    setup: (options: PlayerOptions) => void,
    start: () => void,
    stop: () => void,
    setCursor: (value: number) => void,
};

export type PlayerEvents = {
    onCursor: { value: number },
    onStarted: undefined,
    onStopped: { reset: boolean },
};

const createPlayerWorklet = (
    options: PromiseAudioWorkletOptions<PlayerEvents>,
): PlayerWorklet & PromiseAudioWorkletOnProcess => {
    const { pushEvent, getWorkletState } = options;

    type Started = {
        time: number,
        cursor: number,
    };
    let started: Started | undefined;
    let isPlaying = false;
    const start = (): void => {
        isPlaying = true;
        pushEvent('onStarted', undefined);
    };
    const stop = (reset = false): void => {
        isPlaying = false;
        started = undefined;
        pushEvent('onStopped', { reset });
    };

    type State = {
        soundBuffer: RealArray<'float32'>,
        cursor: number,
    };
    let state: State | undefined;
    const process = (_input: Float32Array[], output: Float32Array[]): void => {
        if (!state) return;
        if (!isPlaying) return;
        const { sampleRate, currentTime } = getWorkletState();
        const { soundBuffer, cursor } = state;
        if (!started) {
            started = {
                time: currentTime,
                cursor,
            };
        }
        const delta = Math.floor((currentTime - started.time) * sampleRate);
        const currentCursor = started.cursor + delta;
        const size = output[0].length;
        if (soundBuffer.real.length < currentCursor + size) {
            stop(true);
            return;
        }
        for (let i = 0; i < output.length; i++) {
            for (let j = 0; j < output[i].length; j++) {
                output[i][j] = soundBuffer.real[currentCursor + j];
            }
        }
        pushEvent('onCursor', { value: currentCursor + size });
    };
    const setup = (playerOptions: PlayerOptions): void => {
        const { cursor } = playerOptions;
        const soundBuffer = viewRealArray('float32', playerOptions.soundBuffer);
        state = { soundBuffer, cursor };
        started = undefined;
    };
    const setCursor = (value: number): void => {
        if (!state) return;
        state.cursor = value;
        started = undefined;
    };
    return {
        process,
        setup,
        start,
        stop,
        setCursor,
    };
};

export const runPlayerWorklet = (): void => {
    runPromiseAudioWorklet('PlayerWorklet', createPlayerWorklet);
};
