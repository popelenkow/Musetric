import { useRef, DependencyList, useCallback, useMemo } from 'react';

export type NotInitializedCacheState = {
	value: undefined;
	isInitialized: false;
	isCallbackChanged: boolean;
};
export type InitializedCacheState<T> = {
	value: T;
	isInitialized: true;
	isCallbackChanged: boolean;
};
export type CacheState<T> = InitializedCacheState<T> | NotInitializedCacheState;
export type GetCacheState<T> = () => CacheState<T>;

export type GetCacheValue<T> = (needRefresh?: boolean) => T;
export const useCache = <T>(
	createValue: () => T,
	deps: DependencyList,
): [GetCacheValue<T>, GetCacheState<T>] => {
	const stateRef = useRef<CacheState<T>>({
		value: undefined,
		isInitialized: false,
		isCallbackChanged: false,
	});

	const getValue = useMemo<GetCacheValue<T>>(() => {
		stateRef.current = { ...stateRef.current, isCallbackChanged: true };
		return (needRefresh?: boolean): T => {
			const prevState = stateRef.current;
			if (prevState.isInitialized && !needRefresh) return prevState.value;
			const value = createValue();
			stateRef.current = {
				value,
				isInitialized: true,
				isCallbackChanged: false,
			};
			return value;
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	const getValueState = useCallback<GetCacheState<T>>(() => {
		return stateRef.current;
	}, []);

	return [getValue, getValueState];
};

export type GetCacheValueAsync<T> = (needRefresh?: boolean) => Promise<T>;
export const useCacheAsync = <T>(
	createValue: () => Promise<T>,
	deps: DependencyList,
): [GetCacheValueAsync<T>, GetCacheState<T>] => {
	const stateRef = useRef<CacheState<T>>({
		value: undefined,
		isInitialized: false,
		isCallbackChanged: false,
	});

	const getValue = useMemo(() => {
		stateRef.current = { ...stateRef.current, isCallbackChanged: true };
		return async (needRefresh?: boolean): Promise<T> => {
			const prevState = stateRef.current;
			if (prevState.isInitialized && !needRefresh) return prevState.value;
			const value = await createValue();
			stateRef.current = {
				value,
				isInitialized: true,
				isCallbackChanged: false,
			};
			return value;
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	const getValueState = useCallback(() => {
		return stateRef.current;
	}, []);

	return [getValue, getValueState];
};
