import { PushEvent } from '../Types/Events';

export type PromiseWorkerRequest = {
    id: string,
    type: string,
    args: unknown[],
};
export type PromiseWorkerResponse = {
    id: string,
    type: string,
    result: unknown,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PromiseWorker = Record<string, (...args: any[]) => unknown>;

export type PromiseWorkerOptions<Events> = {
    pushEvent: PushEvent<Events>,
};

export const runPromiseWorker = <Events>(
    host: Worker,
    createWorker: (options: PromiseWorkerOptions<Events>) => PromiseWorker,
): void => {
    const post = (message: PromiseWorkerResponse): void => {
        host.postMessage(message);
    };

    const options: PromiseWorkerOptions<Events> = {
        pushEvent: (type, result) => {
            const id = '';
            post({ id, type, result });
        },
    };
    const worker = createWorker(options);
    host.onmessage = (event: MessageEvent<PromiseWorkerRequest>): void => {
        const { id, type, args } = event.data;
        const result = worker[type](...args);
        post({ id, type, result });
    };
};
