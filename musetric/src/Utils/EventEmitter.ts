import { createIndexIterator } from './IndexIterator';
import { skipPromise } from './SkipPromise';

export type EventEmitterCallback<TEvent> = (event: TEvent) => Promise<void> | void;
export type EventEmitterUnsubscribe = () => void;
export type EventEmitter<TEvent> = {
	subscribe: (callback: EventEmitterCallback<TEvent>) => EventEmitterUnsubscribe;
	emit: (event: TEvent) => void;
};
export const createEventEmitter = <TEvent>(): EventEmitter<TEvent> => {
	const iterator = createIndexIterator();
	const callbacks: Record<string, EventEmitterCallback<TEvent>> = {};
	const subscribe = (callback: EventEmitterCallback<TEvent>): EventEmitterUnsubscribe => {
		const id = iterator.next((i) => !!callbacks[i]);
		callbacks[id] = callback;
		return () => {
			delete callbacks[id];
		};
	};
	const emit = (event: TEvent) => {
		Object.keys(callbacks).forEach((id) => {
			const callback = callbacks[id];
			const run = async () => {
				await callback(event);
			};
			setTimeout(() => {
				skipPromise(run());
			});
		});
	};
	return {
		subscribe,
		emit,
	};
};
