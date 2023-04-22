import { produce } from 'immer';

type SnapshotOnChange = () => void;
type StoreUnsubscribe = () => void;
export type Store<Snapshot> = {
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
): Store<State & Actions> => {
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
