import React, { createContext, useState, useEffect } from 'react';
import { Api } from '../Api/Api';
import { SoundInfo, commonSampleRate } from '../Api/SoundInfo';
import { useAppApi } from '../App/AppContext';
import { HttpClient } from '../AppBase/HttpClient';
import { decodeArrayBufferToWav } from '../Sounds/Wav';
import { SFC } from '../UtilityTypes/React';
import { Store, createStore, SetStoreState } from '../Utils/Store';
import { useLazyAudioContext } from '../UtilsReact/LazyAudioContext';
import { useContextStore } from '../UtilsReact/Store';

export type KaraokeState = {
    isOpenMusicList?: boolean,
    isMusicListLoading?: boolean,
    soundList: SoundInfo[],
    selectedId?: string,
};
const initialState: KaraokeState = {
    soundList: [],
};

const createActions = (
    setState: SetStoreState<KaraokeState>,
    api: HttpClient,
    getAudioContext: () => AudioContext,
) => ({
    setIsOpenSoundList: (isOpen: boolean) => setState((state) => {
        state.isOpenMusicList = isOpen;
    }),
    refreshSoundList: async () => {
        setState((state) => {
            state.isMusicListLoading = true;
        });
        const response = await api.getJson<Api.GetSoundList.Response>(
            Api.GetSoundList.route,
        ).request();
        setState((state) => {
            state.isMusicListLoading = false;
            if (response.type !== 'ok') return;
            state.soundList = response.result;
        });
    },
    removeSound: async (id: string): Promise<void> => {
        const response = await api.delete(Api.RemoveSound.route(id)).request();

        if (response.type !== 'ok') return;
        setState((state) => {
            state.soundList = state.soundList.filter((x) => x.id !== id);
        });
    },
    selectSound: async (id?: string) => {
        setState((state) => {
            state.selectedId = id;
        });
        if (!id) return;
        const response = await api.get(Api.GetSoundTrack.route(id, 'vocals', 4)).request();
        if (response.type !== 'ok') return;
        const blob = await response.raw.blob();
        const data = await blob.arrayBuffer();
        const audioContext = getAudioContext();
        const channels = await decodeArrayBufferToWav(audioContext, data);
        console.log(channels);
    },
} as const);
type Actions = ReturnType<typeof createActions>;
export type KaraokeSnapshot = KaraokeState & Actions;
type KaraokeStore = Store<KaraokeSnapshot>;

export const KaraokeContext = createContext<KaraokeStore | undefined>(undefined);

export const KaraokeProvider: SFC<object, { children: 'required' }> = (props) => {
    const { children } = props;

    const api = useAppApi();
    const getAudioContext = useLazyAudioContext(commonSampleRate);

    const [store, setStore] = useState<KaraokeStore>();
    useEffect(() => {
        const currentStore = createStore(initialState, (setState) => (
            createActions(setState, api, getAudioContext)
        ));
        setStore(currentStore);
        return () => {};
    }, [api, getAudioContext]);

    return (
        <KaraokeContext.Provider value={store}>
            {store && children}
        </KaraokeContext.Provider>
    );
};

export const useKaraokeStore = <R,>(selector: (store: KaraokeSnapshot) => R): R => (
    useContextStore(KaraokeContext, 'useKaraokeContext', selector)
);
