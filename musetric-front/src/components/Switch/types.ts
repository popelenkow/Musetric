import { TFunction } from "i18next";

export type SwitchProps<T = any> = {
	currentId: T;
	ids: T[];
	set: (id: T) => void;
	className?: string;
	localize?: (id: T, t: TFunction) => string;
};

export type SwitchState = {
	id: any;
};