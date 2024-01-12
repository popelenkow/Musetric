import React, { createContext, useState, useEffect } from 'react';
import { createHttpClient, HttpClient } from '../AppBase/HttpClient';
import { I18n } from '../AppBase/Locale';
import { Log } from '../AppBase/Log';
import { Workers } from '../AppBase/Worker';
import { SFC } from '../UtilityTypes/React';
import { Store, createStore, SetStoreState } from '../Utils/Store';
import { useContextStore } from '../UtilsReact/Store';

export type AppState = {
    rootElement: HTMLElement,
    workers: Workers,
    log: Log,
    i18n: I18n,
    localeId: string,
    allLocaleIds: string[],
    api: HttpClient,
};

const createActions = (
    setState: SetStoreState<AppState>,
    getState: () => AppState,
    onLocaleId?: (localeId: string) => void,
) => ({
    setRootElement: (element: HTMLElement) => setState((state) => {
        state.rootElement = element;
    }),
    setLocaleId: async (id: string): Promise<void> => {
        const snapshot = getState();
        await snapshot.i18n.changeLanguage(id);
        setState((state) => {
            state.localeId = id;
        });
        if (onLocaleId) onLocaleId(id);
    },
} as const);
type Actions = ReturnType<typeof createActions>;
export type AppSnapshot = AppState & Actions;
type AppStore = Store<AppSnapshot>;

export const AppContext = createContext<AppStore | undefined>(undefined);

export type AppProviderProps = {
    initRootElement?: HTMLElement,
    workers: Workers,
    log: Log,
    i18n: I18n,
    allLocaleIds: string[],
    onLocaleId: (localeId: string) => void,
    apiUrl: string,
};
export const AppProvider: SFC<AppProviderProps, { children: 'required' }> = (props) => {
    const {
        initRootElement, workers, log,
        i18n, allLocaleIds, onLocaleId, apiUrl,
        children,
    } = props;

    const [store, setStore] = useState<AppStore>();

    useEffect(() => {
        const initialState: AppState = {
            rootElement: initRootElement || document.body,
            workers,
            log,
            i18n,
            allLocaleIds,
            localeId: i18n.language,
            api: createHttpClient(apiUrl),
        };
        const currentStore = createStore(initialState, (setState, getState) => (
            createActions(setState, getState, onLocaleId)
        ));
        setStore(currentStore);
        return () => {};
    }, [initRootElement, workers, log, i18n, allLocaleIds, onLocaleId, apiUrl]);

    return (
        <AppContext.Provider value={store}>
            {store && children}
        </AppContext.Provider>
    );
};

const createAppStoreSelector = <R,>(selector: (store: AppSnapshot) => R): () => R => (
    () => useContextStore(AppContext, 'useAppContext', selector)
);

export const useAppRootElement = createAppStoreSelector(({
    rootElement,
    setRootElement,
}) => ({
    rootElement,
    setRootElement,
}));

export const useAppWorkers = createAppStoreSelector((store) => store.workers);

export const useAppLog = createAppStoreSelector((store) => store.log);

export const useAppLocale = createAppStoreSelector(({
    i18n,
    localeId,
    allLocaleIds,
    setLocaleId,
}) => ({
    i18n,
    localeId,
    allLocaleIds,
    setLocaleId,
}));

export const useAppApi = createAppStoreSelector((store) => store.api);
