import React, { useState, useEffect, useRef } from 'react';
import { I18n } from '../AppBase/Locale';
import { Log } from '../AppBase/Log';
import { themeVariables } from '../AppBase/Theme';
import { Workers } from '../AppBase/Worker';
import { Icon } from '../Controls/Icon';
import { FCResult } from '../UtilityTypes/React';
import { subscribeDisableZoom } from '../Utils/Zoom';
import { AppBar } from './AppBar';
import { AppProvider, AppProviderProps, useAppRootElement } from './AppContext';
import { createUseClasses, CssProvider, CssProviderProps } from './AppCss';
import { AppDropdown, AppDropdownProps, AppViewEntry, AppViewElement } from './AppDropdown';

const useClasses = createUseClasses('App', {
    root: {
        position: 'absolute',
        'overscroll-behavior': 'none',
        top: 'var(--screenTop, 0px)',
        height: 'var(--100vh, 100vh)',
        width: '100%',
        'box-sizing': 'border-box',
        display: 'grid',
        'grid-template-rows': ' 50px 1fr',
        'grid-template-columns': '1fr',
        'background-color': `var(${themeVariables.background})`,
    },
});

export type AppLayoutProps<ViewId> = {
    initViewId: ViewId,
    useViewEntries: () => AppViewEntry<ViewId>[],
    appBarButtonsSlot: React.JSX.Element,
};
type AppLayoutFC = (
    <ViewId extends string>(props: AppLayoutProps<ViewId>) => FCResult
);
export const AppLayout: AppLayoutFC = (props) => {
    type ViewId = (typeof props)['initViewId'];
    const { initViewId, useViewEntries, appBarButtonsSlot } = props;
    const classes = useClasses();

    const allViewEntries = useViewEntries();
    const { rootElement, setRootElement } = useAppRootElement();
    useEffect(() => subscribeDisableZoom(rootElement), [rootElement]);

    const rootElementRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (rootElementRef.current) setRootElement(rootElementRef.current);
    }, [setRootElement]);

    const [viewId, setViewId] = useState<ViewId>(initViewId);
    const appDropdownProps: AppDropdownProps<ViewId> = {
        viewId,
        setViewId,
        allViewEntries,
    };

    const { element } = allViewEntries
        .filter((x): x is AppViewElement<ViewId> => x.type === 'view')
        .find((view) => view.id === viewId) || {};

    return (
        <div ref={rootElementRef} className={classes.root}>
            <AppBar>
                {appBarButtonsSlot}
                <AppDropdown {...appDropdownProps}><Icon name='menu' /></AppDropdown>
            </AppBar>
            {element}
        </div>
    );
};

export type AppProps<ViewId> = AppLayoutProps<ViewId> & {
    rootElement: HTMLElement,
    workers: Workers,
    log: Log,
    i18n: I18n,
    allLocaleIds: string[],
    onLocaleId: (localeId: string) => void,
    themeId: string,
    allThemeIds: string[],
    setThemeId: (themeId: string) => void,
    apiUrl: string,
};
type AppFC = (
    <ViewId extends string>(props: AppProps<ViewId>) => FCResult
);
export const App: AppFC = (props) => {
    const {
        initViewId,
        useViewEntries,
        appBarButtonsSlot,
        rootElement,
        workers,
        log,
        i18n,
        allLocaleIds,
        onLocaleId,
        themeId,
        allThemeIds,
        setThemeId,
        apiUrl,
    } = props;

    const appProviderProps: AppProviderProps = {
        rootElement,
        workers,
        log,
        i18n,
        allLocaleIds,
        onLocaleId,
        apiUrl,
    };
    const cssProviderProps: CssProviderProps = {
        themeId,
        allThemeIds,
        setThemeId,
    };
    const appLayoutProps: AppLayoutProps<typeof initViewId> = {
        initViewId,
        useViewEntries,
        appBarButtonsSlot,
    };
    return (
        <AppProvider {...appProviderProps}>
            <CssProvider {...cssProviderProps}>
                <AppLayout {...appLayoutProps} />
            </CssProvider>
        </AppProvider>
    );
};
