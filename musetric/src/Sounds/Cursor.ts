import { createEventEmitter, EventEmitter } from './EventEmitter';

export type CursorInputType = 'user' | 'process';
export type OnCursorEvent = {
	value: number;
	inputType: CursorInputType;
};
export type Cursor = {
	readonly get: () => number;
	readonly set: (value: number, inputType: CursorInputType) => void;
	readonly on: EventEmitter<OnCursorEvent>;
};
export const createCursor = (): Cursor => {
	let v = 0;
	const on = createEventEmitter<OnCursorEvent>();
	const set = (value: number, inputType: CursorInputType) => {
		v = value;
		on.emit({ value, inputType });
	};
	const get = () => {
		return v;
	};
	return {
		on,
		set,
		get,
	};
};
