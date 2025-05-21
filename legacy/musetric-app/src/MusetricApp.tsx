import { App, AppProps } from 'musetric/App/App';
import { I18n } from 'musetric/AppBase/Locale';
import { createConsoleLog } from 'musetric/AppBase/Log';
import { Workers } from 'musetric/AppBase/Worker';
import { SFC } from 'musetric/UtilityTypes/React';
import React, { useMemo, useState } from 'react';
import { AppBarButtons } from './common/AppBarButtons';
import { ViewId, useViewEntries } from './common/ViewEntries';
import { setStorageLocaleId, setStorageThemeId } from './LocalStore';
import playerUrl from './Player?url';
import recorderUrl from './Recorder?url';
import { allLocaleEntries } from './Resources/Locales';
import { allThemeIds } from './Resources/Themes';
import SpectrumWorker from './Spectrum?worker&inline';

const workers: Workers = {
    playerUrl,
    recorderUrl,
    createSpectrumWorker: () => new SpectrumWorker(),
};

export type MusetricAppProps = {
    rootElement: HTMLElement,
    apiUrl: string,
    i18n: I18n,
    initThemeId: string,
};
export const MusetricApp: SFC<MusetricAppProps> = (props) => {
    const { rootElement, apiUrl, i18n, initThemeId } = props;
    const [themeId, setThemeId] = useState(initThemeId);

    const log = useMemo(() => createConsoleLog(), []);

    const appProps: AppProps<ViewId> = {
        rootElement,
        appBarButtonsSlot: <AppBarButtons />,
        initViewId: 'soundWorkshop',
        useViewEntries,
        workers,
        log,
        i18n,
        allLocaleIds: allLocaleEntries.map((x) => x.localeId),
        onLocaleId: setStorageLocaleId,
        themeId,
        allThemeIds,
        setThemeId: (id) => {
            rootElement.setAttribute('data-theme', id);
            setThemeId(id);
            setStorageThemeId(id);
        },
        apiUrl,
    };

    return <App {...appProps} />;
};
