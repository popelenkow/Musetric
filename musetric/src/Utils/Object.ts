export const mapObject = <Key extends string, Value, Result>(
	obj: Record<Key, Value>,
	map: (value: Value) => Result,
): Record<Key, Result> => {
	const result: Record<Key, Result> = {} as Record<Key, Result>;
	const keys = Object.keys(obj) as Key[];
	keys.forEach((key) => {
		result[key] = map(obj[key]);
	});
	return result;
};

export const someObject = <Key extends string, Value>(
	obj: Record<Key, Value>,
	predicate: (value: Value) => boolean,
): boolean => {
	const keys = Object.keys(obj) as Key[];
	return keys.some((key) => predicate(obj[key]));
};
