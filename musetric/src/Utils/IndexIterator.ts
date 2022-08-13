export type IndexIterator = {
	current: () => string,
	next: (needNext?: (id: string) => boolean) => string,
};
export const createIndexIterator = (): IndexIterator => {
	let index = Number.MAX_SAFE_INTEGER - 1;

	const getId = (): string => index.toString(10);
	const next: IndexIterator['next'] = (needNext) => {
		const isNext = (): boolean => {
			if (!needNext) return false;
			return needNext(getId());
		};
		do {
			index = (index + 1) % Number.MAX_SAFE_INTEGER;
		} while (isNext());
		return getId();
	};
	return {
		current: getId,
		next,
	};
};
