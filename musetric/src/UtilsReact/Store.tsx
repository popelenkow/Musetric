import { memoize } from 'proxy-memoize';
import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { Store } from '../Utils/Store';
import { useInitializedContext } from './Context';

export const useContextStore = <Snapshot extends object, R>(
	SoundWorkshopContext: React.Context<Store<Snapshot> | undefined>,
	contextName: string,
	selector: (store: Snapshot) => R,
): R => {
	const context = useInitializedContext(SoundWorkshopContext, contextName);

	const snapshotRef = useRef<R>();
	const [, forceUpdate] = useState(false);

	const memoizedSelector = useMemo(() => memoize(selector), [selector]);
	if (!snapshotRef.current) {
		snapshotRef.current = memoizedSelector(context.getSnapshot());
	}
	useLayoutEffect(() => {
		snapshotRef.current = memoizedSelector(context.getSnapshot());
		const unsubscribe = context.subscribe(() => {
			const snapshot = memoizedSelector(context.getSnapshot());
			if (snapshotRef.current === snapshot) return;
			snapshotRef.current = snapshot;
			forceUpdate((x) => !x);
		});
		return unsubscribe;
	}, [context, memoizedSelector]);

	return snapshotRef.current;
};
