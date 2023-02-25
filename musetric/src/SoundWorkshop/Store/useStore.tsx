import { memoize } from 'proxy-memoize';
import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { useInitializedContext } from '../../ReactUtils';

type ContextStoreOnChange = () => void;
type ContextStoreUnsubscribe = () => void;
export type ContextStore<Store> = {
	subscribe: (onChange: ContextStoreOnChange) => ContextStoreUnsubscribe,
	getSnapshot: () => Store,
	destroy: () => void,
};
export const useContextStore = <Store extends object, R>(
	SoundWorkshopContext: React.Context<ContextStore<Store> | undefined>,
	contextName: string,
	selector: (store: Store) => R,
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

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return snapshotRef.current;
};
