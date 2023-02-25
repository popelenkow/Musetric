import produce from 'immer';
import { memoize } from 'proxy-memoize';
import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { useInitializedContext } from '../../ReactUtils';

type SnapshotOnChange = () => void;
type StoreUnsubscribe = () => void;
export type ContextStore<Snapshot> = {
	subscribe: (onChange: SnapshotOnChange) => StoreUnsubscribe,
	getSnapshot: () => Snapshot,
};

export type SetStoreState<State> = (callback: (state: State) => State | void) => void;
type CreateActions<State, Actions> = (
	setState: SetStoreState<State>,
	getState: () => State,
) => Actions;

export const createStore = <State, Actions>(
	initialState: State,
	createActions: CreateActions<State, Actions>,
): ContextStore<State & Actions> => {
	const subscriptions = new Set<SnapshotOnChange>();

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	let actions = {} as Actions;
	let snapshot: State & Actions = {
		...initialState,
		...actions,
	};

	const getState = (): State => snapshot;
	const setState: SetStoreState<State> = (callback) => {
		snapshot = {
			...produce(snapshot, callback),
			...actions,
		};
		subscriptions.forEach((x) => x());
	};
	actions = createActions(setState, getState);
	snapshot = {
		...snapshot,
		...actions,
	};

	return {
		subscribe: (callback) => {
			subscriptions.add(callback);
			return () => {
				subscriptions.delete(callback);
			};
		},
		getSnapshot: () => snapshot,
	} as const;
};

export const useContextStore = <Snapshot extends object, R>(
	SoundWorkshopContext: React.Context<ContextStore<Snapshot> | undefined>,
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
