import { v4 as uuid } from 'uuid';
import type { EventHandlers } from '../Typescript/Events';
import type { PromiseWorker, PromiseWorkerResponse, PromiseWorkerRequest } from './PromiseWorker';

export const createPromiseWorkerApi = <TypedWorker extends PromiseWorker, Events>(
	port: Worker | MessagePort,
	handlers: EventHandlers<Events>,
) => {
	const postMessage = (message: PromiseWorkerRequest): void => {
		port.postMessage(message);
	};
	const handleEvent = (type: string, event: unknown) => {
		type Event = keyof Events;
		const handle = handlers[type as Event];
		if (handle) {
			handle(event as Events[Event]);
			return true;
		}
		return false;
	};
	const callbacks: Record<string, (result: unknown) => void> = {};
	port.onmessage = (event: MessageEvent<PromiseWorkerResponse>) => {
		const { id, type, result } = event.data;
		if (handleEvent(type, result)) return;
		const callback = callbacks[id];
		delete callbacks[id];
		callback(result);
	};

	const request = <Type extends keyof TypedWorker & string>(
		type: Type,
		args: Parameters<TypedWorker[Type]>,
	) => {
		type ResultType = ReturnType<TypedWorker[Type]>;
		return new Promise<ResultType>((resolve) => {
			const id = uuid();
			const callback = (result: unknown) => {
				resolve(result as ResultType);
			};
			callbacks[id] = callback;
			postMessage({ id, type, args });
		});
	};
	return request;
};
