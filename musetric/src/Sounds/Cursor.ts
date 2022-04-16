import { createEventEmitter } from './EventEmitter';

export type CursorInputType = 'user' | 'process';
export type OnCursorEvent = {
	value: number;
	inputType: CursorInputType;
};
export const createCursor = () => {
	let v = 0;
	const onCursor = createEventEmitter<OnCursorEvent>();
	const set = (value: number, inputType: CursorInputType) => {
		v = value;
		onCursor.emit({ value, inputType });
	};
	const get = () => {
		return v;
	};
	return {
		onCursor,
		set,
		get,
	} as const;
};
export type Cursor = ReturnType<typeof createCursor>;
