export type UndefinedObject<Obj> = {
	[K in keyof Obj]: undefined;
};
