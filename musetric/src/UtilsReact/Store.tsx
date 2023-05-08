import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Store } from '../Utils/Store';
import { useInitializedContext } from './Context';

const shallowEqual = (object1: unknown, object2: unknown): boolean => {
	if (object1 === object2) return true;
	const isObj = (obj: unknown): obj is Record<string, unknown> => (
		typeof obj === 'object' && !!obj
	);
	if (!isObj(object1)) return false;
	if (!isObj(object2)) return false;

	const keys1 = Object.keys(object1);
	const keys2 = Object.keys(object2);
	if (keys1.length !== keys2.length) {
		return false;
	}
	// eslint-disable-next-line no-restricted-syntax
	for (const key of keys1) {
		if (object1[key] !== object2[key]) {
			return false;
		}
	}
	return true;
};

type SelectorRef<State, Result> = {
	state: State,
	result: Result,
};

const createSelector = <State, Result>(
	select: (state: State) => Result,
	last: {
		get: () => SelectorRef<State, Result>,
		set: (ref: SelectorRef<State, Result>) => void,
	},
) => {
	return (state: State): boolean => {
		const lastRef = last.get();
		if (lastRef && shallowEqual(lastRef.state, state)) {
			return true;
		}
		let result = select(state);
		const isSameResult = lastRef && shallowEqual(lastRef.result, result);
		if (isSameResult) {
			result = lastRef.result;
		}
		last.set({ state, result });
		return isSameResult;
	};
};

export const useContextStore = <Snapshot extends object, R>(
	StoreContext: React.Context<Store<Snapshot> | undefined>,
	contextName: string,
	select: (snapshot: Snapshot) => R,
): R => {
	const store = useInitializedContext(StoreContext, contextName);

	const prevRef = useRef<SelectorRef<Snapshot, R>>();

	if (!prevRef.current) {
		const state = store.getSnapshot();
		const result = select(state);
		prevRef.current = {
			result,
			state,
		};
	}

	const selector = useMemo(() => createSelector(select, {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		get: () => prevRef.current!,
		set: (ref) => {
			prevRef.current = ref;
		},
	}), [select]);

	const [, forceUpdate] = useState({});
	useEffect(() => {
		const unsubscribe = store.subscribe(() => {
			const isSame = selector(store.getSnapshot());
			if (isSame) return;
			forceUpdate({});
		});
		return unsubscribe;
	}, [store, selector]);

	return prevRef.current.result;
};
