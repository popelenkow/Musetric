export type SwitchProps<T> = {
	currentId: T;
	ids: T[];
	set: (id: T) => void;
	className?: string;
	localize?: (id: T) => string;
};

export type SwitchState<T> = {
	id: T;
};