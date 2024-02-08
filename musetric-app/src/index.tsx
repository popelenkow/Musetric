import { createI18n } from 'musetric/AppBase/Locale';
import { skipPromise } from 'musetric/Utils/SkipPromise';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { getLocalIp } from './ip';
import { getStorageLocaleId, getStorageThemeId } from './LocalStore';
import { MusetricApp, MusetricAppProps } from './MusetricApp';
import { allLocaleEntries } from './Resources/Locales';

const run = async (): Promise<void> => {
    const elementId = 'root';
    const rootElement = document.getElementById(elementId)!;

    const initLocaleId = getStorageLocaleId() || 'en';
    const i18n = await createI18n(initLocaleId, allLocaleEntries);

    const initThemeId = getStorageThemeId() || 'dark';
    rootElement.setAttribute('data-theme', initThemeId);

    const ip = await getLocalIp();
    const props: MusetricAppProps = {
        rootElement,
        apiUrl: `http://${ip}:3001`,
        i18n,
        initThemeId,
    };

    const root = createRoot(rootElement);
    root.render(<StrictMode><MusetricApp {...props} /></StrictMode>);
    document.getElementById('splashScreen')!.style.display = 'none';
};

skipPromise(run());
