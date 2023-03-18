import React, { createContext, useState, useEffect } from 'react';
import { SFC } from '../UtilityTypes/React';
import { Store, createStore, SetStoreState } from '../Utils/Store';
import { useContextStore } from '../UtilsReact/Store';

export type KaraokeState = {
	id?: number,
};
const initialState: KaraokeState = {};

const createActions = (
	setState: SetStoreState<KaraokeState>,
) => ({
	setId: (id?: number) => setState((state) => {
		state.id = id;
	}),
} as const);
type Actions = ReturnType<typeof createActions>;
export type KaraokeSnapshot = KaraokeState & Actions;
type KaraokeStore = Store<KaraokeSnapshot>;

export const KaraokeContext = createContext<KaraokeStore | undefined>(undefined);

export const KaraokeProvider: SFC<object, { children: 'required' }> = (props) => {
	const { children } = props;

	const [store, setStore] = useState<KaraokeStore>();
	useEffect(() => {
		const currentStore = createStore(initialState, (setState) => (
			createActions(setState)
		));
		setStore(currentStore);
		return () => {};
	}, []);

	return (
		<KaraokeContext.Provider value={store}>
			{store && children}
		</KaraokeContext.Provider>
	);
};

export const useKaraokeStore = <R,>(selector: (store: KaraokeSnapshot) => R): R => (
	useContextStore(KaraokeContext, 'useKaraokeContext', selector)
);
