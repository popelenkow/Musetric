export type ValueObject<Obj, Value> = {
	[K in keyof Obj]: Value;
};
