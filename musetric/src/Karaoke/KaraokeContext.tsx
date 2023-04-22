import { Api } from 'musetric-api/Api';
import { SeparationTaskInfo } from 'musetric-api/SeparationTaskInfo';
import React, { createContext, useState, useEffect } from 'react';
import { useAppApi } from '../App/AppContext';
import { HttpClient } from '../AppBase/HttpClient';
import { SFC } from '../UtilityTypes/React';
import { Store, createStore, SetStoreState } from '../Utils/Store';
import { useContextStore } from '../UtilsReact/Store';

export type KaraokeState = {
	isOpenMusicList?: boolean,
	isMusicListLoading?: boolean,
	musicList: SeparationTaskInfo[],
	selectedId?: string,
};
const initialState: KaraokeState = {
	musicList: [],
};

const createActions = (
	setState: SetStoreState<KaraokeState>,
	api: HttpClient,
) => ({
	setIsOpenMusicList: (isOpen: boolean) => setState((state) => {
		state.isOpenMusicList = isOpen;
	}),
	refreshMusicList: async () => {
		setState((state) => {
			state.isMusicListLoading = true;
		});
		const response = await api.getJson<Api.SeparateList.Response>(
			Api.SeparateList.route,
		).request();
		setState((state) => {
			state.isMusicListLoading = false;
			if (response.type !== 'ok') return;
			state.musicList = response.result;
		});
	},
	selectMusic: (id?: string) => setState((state) => {
		state.selectedId = id;
	}),
	removeMusic: async (id: string): Promise<void> => {
		const response = await api.postJson<unknown, Api.Remove.Request>(
			Api.Remove.route,
			{ id },
		).request();

		if (response.type !== 'ok') return;
		setState((state) => {
			state.musicList = state.musicList.filter((x) => x.id !== id);
		});
	},
} as const);
type Actions = ReturnType<typeof createActions>;
export type KaraokeSnapshot = KaraokeState & Actions;
type KaraokeStore = Store<KaraokeSnapshot>;

export const KaraokeContext = createContext<KaraokeStore | undefined>(undefined);

export const KaraokeProvider: SFC<object, { children: 'required' }> = (props) => {
	const { children } = props;

	const api = useAppApi();
	const [store, setStore] = useState<KaraokeStore>();
	useEffect(() => {
		const currentStore = createStore(initialState, (setState) => (
			createActions(setState, api)
		));
		setStore(currentStore);
		return () => {};
	}, [api]);

	return (
		<KaraokeContext.Provider value={store}>
			{store && children}
		</KaraokeContext.Provider>
	);
};

export const useKaraokeStore = <R,>(selector: (store: KaraokeSnapshot) => R): R => (
	useContextStore(KaraokeContext, 'useKaraokeContext', selector)
);
