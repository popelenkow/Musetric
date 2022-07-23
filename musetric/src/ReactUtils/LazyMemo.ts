import { useRef, DependencyList, useMemo } from 'react';

export const useLazyMemo = <T>(
	createValue: (prevValue: T | undefined) => T,
	deps: DependencyList,
): () => T => {
	type LazyState = (
		| { value: T | undefined; actual: false }
		| { value: T; actual: true }
	);

	const stateRef = useRef<LazyState>({
		value: undefined,
		actual: false,
	});

	const getValue = useMemo(() => {
		stateRef.current = { ...stateRef.current, actual: false };
		return (): T => {
			const prevState = stateRef.current;
			if (prevState.actual) return prevState.value;
			const value = createValue(prevState.value);
			stateRef.current = {
				value,
				actual: true,
			};
			return value;
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return getValue;
};

export const useLazyMemoAsync = <T>(
	createValue: (prevValue: T | undefined) => Promise<T>,
	deps: DependencyList,
): () => Promise<T> => {
	type LazyState = (
		| { value: T | undefined; actual: false }
		| { value: T; actual: true }
	);

	const stateRef = useRef<LazyState>({
		value: undefined,
		actual: false,
	});

	const getValue = useMemo(() => {
		stateRef.current = { ...stateRef.current, actual: false };
		return async (): Promise<T> => {
			const prevState = stateRef.current;
			if (prevState.actual) return prevState.value;
			const value = await createValue(prevState.value);
			stateRef.current = {
				value,
				actual: true,
			};
			return value;
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return getValue;
};
