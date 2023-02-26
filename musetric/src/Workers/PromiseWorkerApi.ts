import type { EventHandlers } from '../Types/Events';
import { createIndexIterator } from '../Utils/IndexIterator';
import type { PromiseWorker, PromiseWorkerResponse, PromiseWorkerRequest } from './PromiseWorker';

export type PromiseWorkerApi<TypedWorker extends PromiseWorker> = (
	<Type extends keyof TypedWorker & string>(
		type: Type,
		args: Parameters<TypedWorker[Type]>,
	) => Promise<ReturnType<TypedWorker[Type]>>
);
export const createPromiseWorkerApi = <TypedWorker extends PromiseWorker, Events>(
	port: Worker | MessagePort,
	handlers: EventHandlers<Events>,
): PromiseWorkerApi<TypedWorker> => {
	const postMessage = (message: PromiseWorkerRequest): void => {
		port.postMessage(message);
	};
	const handleEvent = (type: string, event: unknown): boolean => {
		type Event = keyof Events;
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		const handle = handlers[type as Event];
		if (handle) {
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			handle(event as Events[Event]);
			return true;
		}
		return false;
	};
	const callbacks: Record<string, (result: unknown) => void> = {};
	port.onmessage = (event: MessageEvent<PromiseWorkerResponse>): void => {
		const { id, type, result } = event.data;
		if (handleEvent(type, result)) return;
		const callback = callbacks[id];
		delete callbacks[id];
		callback(result);
	};

	const iterator = createIndexIterator();
	const request: PromiseWorkerApi<TypedWorker> = (type, args) => {
		type ResultType = ReturnType<TypedWorker[typeof type]>;
		return new Promise<ResultType>((resolve) => {
			const id = iterator.next((i) => !!callbacks[i]);
			const callback = (result: unknown): void => {
				// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
				resolve(result as ResultType);
			};
			callbacks[id] = callback;
			postMessage({ id, type, args });
		});
	};
	return request;
};
