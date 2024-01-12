import type { EventHandlers } from '../Types/Events';
import type { PromiseObjectApi } from '../UtilityTypes/PromiseObjectApi';
import { createPromiseWorkerApi } from '../Workers/PromiseWorkerApi';
import type { RecorderWorklet, RecorderEvents } from './RecorderWorklet';

export type Recorder = PromiseObjectApi<RecorderWorklet> & {
    destroy: () => void,
    mediaStream: MediaStream,
};

export const createRecorder = async (
    workletUrl: URL | string,
    channelCount: number,
    handlers: EventHandlers<RecorderEvents>,
): Promise<Recorder> => {
    const audioContext = new AudioContext();
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount } });
    const source = audioContext.createMediaStreamSource(mediaStream);
    source.channelCount = channelCount;
    const options: AudioWorkletNodeOptions = {
        channelCount,
        numberOfOutputs: 0,
        numberOfInputs: 1,
    };
    await source.context.audioWorklet.addModule(workletUrl);
    const worklet = new AudioWorkletNode(source.context, 'RecorderWorklet', options);
    source.connect(worklet);
    const request = createPromiseWorkerApi<RecorderWorklet, RecorderEvents>(worklet.port, handlers);
    const result: Recorder = {
        start: (...args) => request('start', args),
        stop: (...args) => request('stop', args),
        destroy: () => {
            worklet.disconnect();
            source.disconnect();
        },
        mediaStream,
    };
    return result;
};
