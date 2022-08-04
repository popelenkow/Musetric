export const createIndexIterator = () => {
	let index = Number.MAX_SAFE_INTEGER - 1;
	const getId = () => index.toString(10);
	return {
		current: getId,
		next: (needNext?: (id: string) => boolean) => {
			do {
				index = (index + 1) % Number.MAX_SAFE_INTEGER;
			} while (needNext?.(getId()));
			return getId();
		},
	} as const;
};
