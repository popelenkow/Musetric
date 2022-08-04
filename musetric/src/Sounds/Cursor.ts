import { createEventEmitter } from '../Utils/EventEmitter';

export type CursorInputType = 'user' | 'process';
export type OnCursorEvent = {
	value: number,
	inputType: CursorInputType,
};
export const createCursor = () => {
	let v = 0;
	const emitter = createEventEmitter<OnCursorEvent>();
	const set = (value: number, inputType: CursorInputType): void => {
		v = value;
		emitter.emit({ value, inputType });
	};
	const get = (): number => {
		return v;
	};
	return {
		emitter,
		set,
		get,
	} as const;
};
export type Cursor = ReturnType<typeof createCursor>;
