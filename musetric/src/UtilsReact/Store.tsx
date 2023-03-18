import React, { useRef, useLayoutEffect, useState } from 'react';
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

export const useContextStore = <Snapshot extends object, R>(
	StoreContext: React.Context<Store<Snapshot> | undefined>,
	contextName: string,
	selector: (snapshot: Snapshot) => R,
): R => {
	const store = useInitializedContext(StoreContext, contextName);

	const snapshotRef = useRef<R>();
	const [, forceUpdate] = useState(false);

	if (!snapshotRef.current) {
		snapshotRef.current = selector(store.getSnapshot());
	}
	useLayoutEffect(() => {
		snapshotRef.current = selector(store.getSnapshot());
		const unsubscribe = store.subscribe(() => {
			const snapshot = selector(store.getSnapshot());
			if (shallowEqual(snapshotRef.current, snapshot)) return;
			snapshotRef.current = snapshot;
			forceUpdate((x) => !x);
		});
		return unsubscribe;
	}, [store, selector]);

	return snapshotRef.current;
};
