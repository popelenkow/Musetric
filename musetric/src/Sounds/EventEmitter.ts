import { skipPromise } from '../Utils/SkipPromise';

export type EventEmitterCallback<TEvent> = (event: TEvent) => Promise<void> | void;
export type EventEmitterUnsubscribe = () => void;
export type EventEmitter<TEvent> = {
	subscribe: (callback: EventEmitterCallback<TEvent>) => EventEmitterUnsubscribe;
	emit: (event: TEvent) => void;
};
export const createEventEmitter = <TEvent>(): EventEmitter<TEvent> => {
	let index = 0;
	const callbacks: Record<string, EventEmitterCallback<TEvent>> = {};
	const subscribe = (callback: EventEmitterCallback<TEvent>): EventEmitterUnsubscribe => {
		const i = index;
		index = i + 1;
		callbacks[i] = callback;
		return () => {
			delete callbacks[i];
		};
	};
	const emit = (event: TEvent) => {
		Object.keys(callbacks).forEach((i) => {
			const callback = callbacks[i];
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
